import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsJSON()
  schema: JSON;
}
