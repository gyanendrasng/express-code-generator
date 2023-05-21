import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { existsSync } from 'fs';
import { exec } from 'shelljs';
import { Project } from './interface';
import { PROJECT_STORAGE_PATH } from 'config';
import { createExpressServer, createFoldersAndFiler } from './helpers';

@Injectable()
export class ProjectBuilderService {
  createproject(data: Project) {
    try {
      exec(
        `./apps/project-builder/src/shell-scripts/create-project.sh ${PROJECT_STORAGE_PATH}/${data.id}`,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  buildproject(data: Project) {
    try {
      if (!existsSync(`${PROJECT_STORAGE_PATH}/${data.id}/index.js`)) {
        exec(`rm -rf ./${data.id}`);
        this.createproject(data);
      }
      createExpressServer(data);
      createFoldersAndFiler(data);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
