import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateProjectDto } from './dtos';
import { ProjectService } from './project.service';
import { GetUser } from 'src/auth/decorator';
import { AccessTokenGuard } from 'src/auth/guards';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  createProject(@Body() body: CreateProjectDto, @GetUser('id') userId: string) {
    return this.projectService.createProject(body, userId);
  }

  @Patch('updateSchema')
  @UseGuards(AccessTokenGuard)
  updateSchema() {
    return this.projectService.updateSchema();
  }
}
