import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dtos';
import { exec } from 'shelljs';

@Injectable()
export class ProjectService {
  constructor(private prismaService: PrismaService) {}
  async createProject(dto: CreateProjectDto, userId: string) {
    try {
      const project = await this.prismaService.project.create({
        data: {
          name: dto.name,
          ownerType: dto.ownerType,
          schema: {},
          ownerId: userId,
        },
      });
      exec(`./bash/create-project.sh ${project.id}`);
      return project;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  updateSchema() {
    return 'updating schema';
  }
}
