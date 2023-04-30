import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cache } from 'cache-manager';
import {
  SignUpDto,
  SignInDto,
  RefreshTokenDto,
  ResetPasswordDto,
} from './dtos';
import { refreshTokens, signIn, signTokens, signUp } from './interfaces';
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME_IN_SECONDS,
} from 'config';
import { concatTokens, createTokenFingerprint } from './utils';
import { CookieOptions, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    console.log(REFRESH_TOKEN_EXPIRE_TIME_IN_SECONDS);
  }

  cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: REFRESH_TOKEN_EXPIRE_TIME_IN_SECONDS,
  };

  async signUp(dto: SignUpDto, response: Response): Promise<signUp> {
    const hash = await argon.hash(dto.password, { type: argon.argon2id });
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          roles: true,
          emailVerified: true,
        },
      });

      const {
        fingerprint,
        fingerprintHash,
      }: { fingerprint: string; fingerprintHash: string } =
        createTokenFingerprint();
      const { accessToken, refreshToken } = await this.signTokens(
        user.id,
        fingerprintHash,
      );
      await this.saveTokensOnCache(user.id, accessToken, refreshToken);
      delete user.id;
      response.cookie('__Secure-Fgp', fingerprint, this.cookieOptions);
      return {
        ...user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(['email is already in use']);
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async signIn(dto: SignInDto, response: Response): Promise<signIn> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          roles: true,
          status: true,
          password: true,
          emailVerified: true,
        },
      });
      if (!user) throw new ForbiddenException('Invalid email or password');
      const passwordMatches = await argon.verify(user.password, dto.password);
      if (!passwordMatches)
        throw new ForbiddenException('Invalid email or password');
      if (user.status === ('DELETED' || 'SUSPENDED'))
        throw new ForbiddenException('User has been suspended or deleted');
      delete user.password;
      const {
        fingerprint,
        fingerprintHash,
      }: { fingerprint: string; fingerprintHash: string } =
        createTokenFingerprint();
      const { accessToken, refreshToken } = await this.signTokens(
        user.id,
        fingerprintHash,
      );
      await this.saveTokensOnCache(user.id, accessToken, refreshToken);
      delete user.id;
      response.cookie('__Secure-Fgp', fingerprint, this.cookieOptions);
      return {
        ...user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new ForbiddenException([error.message]);
    }
  }

  async signOut(id: string) {
    await this.cacheManager.del(id);
    return {
      message: 'logged out',
    };
  }

  async resetPassword(dto: ResetPasswordDto, id: string, response: Response) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          password: true,
        },
      });
      if (!user) throw new ForbiddenException('user doesnt exsist');
      const passwordMatches = await argon.verify(
        user.password,
        dto.currentPassword,
      );
      if (!passwordMatches)
        throw new ForbiddenException('current password is wrong');
      const newHash = await argon.hash(dto.newPassword, {
        type: argon.argon2id,
      });
      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          password: newHash,
        },
      });
      const {
        fingerprint,
        fingerprintHash,
      }: { fingerprint: string; fingerprintHash: string } =
        createTokenFingerprint();
      const { accessToken, refreshToken } = await this.signTokens(
        id,
        fingerprintHash,
      );
      await this.saveTokensOnCache(id, accessToken, refreshToken);
      response.cookie('__Secure-Fgp', fingerprint, this.cookieOptions);
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new ForbiddenException([error.message]);
    }
  }

  async getNewTokens(
    refreshJwtToken: RefreshTokenDto,
    response: Response,
  ): Promise<refreshTokens> {
    const {
      fingerprint,
      fingerprintHash,
    }: { fingerprint: string; fingerprintHash: string } =
      createTokenFingerprint();
    const { accessToken, refreshToken } = await this.signTokens(
      refreshJwtToken.sub,
      fingerprintHash,
    );
    await this.saveTokensOnCache(
      refreshJwtToken.sub,
      accessToken,
      refreshToken,
    );
    response.cookie('__Secure-Fgp', fingerprint, this.cookieOptions);
    return {
      accessToken,
      refreshToken,
    };
  }

  async signTokens(id: string, fingerprintHash: string): Promise<signTokens> {
    const payload = {
      sub: id,
      fingerprintHash,
    };
    const accessTokenSecret = this.config.get('ACCESS_TOKEN_SIGNING_SECRET');
    const refreshTokenSecret = this.config.get('REFRESH_TOKEN_SIGNING_SECRET');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
        secret: accessTokenSecret,
      }),
      this.jwt.signAsync(payload, {
        expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
        secret: refreshTokenSecret,
      }),
    ]);
    await this.saveTokensOnCache(id, accessToken, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveTokensOnCache(
    id: string,
    accessToken: string,
    refreshToken: string,
  ) {
    //refreshTokenLifetime should be same as the REFRESH_TOKEN_EXPIRE_TIME as that will be the ttl
    const refreshTokenLifetime = REFRESH_TOKEN_EXPIRE_TIME_IN_SECONDS * 1000;
    const tokensAndHash = concatTokens(accessToken, refreshToken);
    await this.cacheManager.set(id, tokensAndHash, refreshTokenLifetime);
  }
}
