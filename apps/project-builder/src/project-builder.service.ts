import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { writeFileSync, existsSync } from 'fs';
import { exec } from 'shelljs';
import { Project } from './interface';
import { expressServer, importStatements } from './snippets';
import { PROJECT_STORAGE_PATH } from 'config';

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
      writeFileSync(
        `${PROJECT_STORAGE_PATH}/${data.id}/index.js`,
        importStatements + expressServer,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
