import { Test, TestingModule } from '@nestjs/testing';
import { ProjectBuilderController } from './project-builder.controller';
import { ProjectBuilderService } from './project-builder.service';

describe('ProjectBuilderController', () => {
  let projectBuilderController: ProjectBuilderController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProjectBuilderController],
      providers: [ProjectBuilderService],
    }).compile();

    projectBuilderController = app.get<ProjectBuilderController>(ProjectBuilderController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(projectBuilderController.getHello()).toBe('Hello World!');
    });
  });
});
