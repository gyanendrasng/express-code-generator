import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dtos';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class ProjectService {
  constructor(
    private prismaService: PrismaService,
    @Inject('PROJECT_SERVICE') private readonly projectClient: ClientKafka,
  ) {}

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
      this.projectClient.emit('project_created', project);
      return project;
    } catch (error) {
      throw new ConflictException('Project already exists');
    }
  }

  async updateSchema(dto: UpdateProjectDto) {
    try {
      const schema = JSON.parse(dto.schema as any);
      const project = await this.prismaService.project.update({
        where: { id: dto.id },
        data: { schema: schema },
        select: {
          id: true,
          name: true,
          schema: true,
        },
      });
      if (!project) throw new NotFoundException('Project not found');
      this.projectClient.emit('project_built', project);
    } catch (error) {}
  }
}
