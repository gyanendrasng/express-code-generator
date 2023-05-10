import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignUpDto,
  SignInDto,
  RefreshTokenDto,
  ResetPasswordDto,
} from './dtos';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';
import { refreshTokens, signIn, signUp } from './interfaces';
import { GetUser } from './decorator';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(
    @Body() body: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<signIn> {
    return this.authService.signUp(body, response);
  }

  @Post('signin')
  signIn(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<signUp> {
    return this.authService.signIn(body, response);
  }

  @UseGuards(AccessTokenGuard)
  @Post('signout')
  signout(@GetUser('id') userId: string) {
    return this.authService.signOut(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('resetpassword')
  resetPassword(
    @Body() body: ResetPasswordDto,
    @GetUser('id') userId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.resetPassword(body, userId, response);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  getNewTokens(
    @GetUser() refreshJwtToken: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<refreshTokens> {
    return this.authService.getNewTokens(refreshJwtToken, response);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/checksignin')
  checkSignIn() {
    return {
      message: 'signed in',
    };
  }
}
