import { NestFactory } from '@nestjs/core';
import { ProjectBuilderModule } from './project-builder.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProjectBuilderModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'project-consumer',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
