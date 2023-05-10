import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStratergy, RefreshTokenStratergy } from './startergies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStratergy, RefreshTokenStratergy],
  exports: [AuthService],
})
export class AuthModule {}
