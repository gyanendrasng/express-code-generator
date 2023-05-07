import { IsJSON, IsNotEmpty } from 'class-validator';

export class UpdateProjectDto {
  @IsNotEmpty()
  @IsJSON()
  schema: JSON;
}
