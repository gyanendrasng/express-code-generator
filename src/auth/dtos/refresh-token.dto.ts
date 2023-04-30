import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sub;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  iat;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  exp;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken;
}
