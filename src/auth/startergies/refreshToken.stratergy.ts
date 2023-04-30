import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { jwtToken } from 'src/auth/interfaces';
import { verifyTokenFingerprint } from 'src/auth/utils';

@Injectable()
export class RefreshTokenStratergy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('REFRESH_TOKEN_SIGNING_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: jwtToken) {
    const refreshToken = request
      .get('authorization')
      .replace('Bearer', '')
      .trim();
    try {
      const storedToken = JSON.parse(await this.cacheManager.get(payload.sub));
      if (!storedToken) return null;
      if (storedToken.refreshToken !== refreshToken) {
        return null;
      }
      const fingerprint = request.cookies['__Secure-Fgp'];
      if (!verifyTokenFingerprint(fingerprint, payload['fingerprintHash']))
        return null;
      return { ...payload, refreshToken };
    } catch (error) {}
  }
}
