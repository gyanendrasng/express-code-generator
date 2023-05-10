import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PROJECT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'project',
            brokers: [process.env.KAFKA_BROKER_HOST],
          },
          consumer: {
            groupId: 'project-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
