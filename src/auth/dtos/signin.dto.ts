import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty()
  @IsEmail({}, { message: 'invalid email format' })
  @IsNotEmpty()
  email;

  @ApiProperty()
  @IsNotEmpty()
  password;
}
