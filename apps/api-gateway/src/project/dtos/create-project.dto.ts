import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum OwnerType {
  USER = 'USER',
  TEAM = 'TEAM',
}
export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(OwnerType, { message: 'ownerType must be USER or TEAM' })
  ownerType;
}
