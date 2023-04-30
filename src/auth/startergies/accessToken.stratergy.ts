import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtToken } from 'src/auth/interfaces';
import { Request } from 'express';
import { verifyTokenFingerprint } from 'src/auth/utils';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccessTokenStratergy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    readonly config: ConfigService,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('ACCESS_TOKEN_SIGNING_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: jwtToken) {
    const accessToken = request
      .get('authorization')
      .replace('Bearer', '')
      .trim();
    try {
      const storedToken = JSON.parse(await this.cacheManager.get(payload.sub));
      if (!storedToken) return null;
      if (storedToken.accessToken !== accessToken) {
        return null;
      }
      const fingerprint = request.cookies['__Secure-Fgp'];
      if (!verifyTokenFingerprint(fingerprint, payload['fingerprintHash']))
        return null;
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
        select: {
          id: true,
          roles: true,
          status: true,
        },
      });
      if (user.status === 'DELETED' || user.status === 'SUSPENDED') return null;
      return user;
    } catch (error) {}
  }
}
