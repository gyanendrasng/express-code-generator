import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Project } from './interface';
import { writeFileSync, existsSync } from 'fs';
import { exec } from 'shelljs';

@Injectable()
export class BuildingService {
  createproject(data: Project) {
    try {
      exec(
        `./shell-scripts/create-project.sh ${process.env.PROJECT_STORAGE_PATH}/${data.id}`,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  buildproject(data: Project) {
    try {
      if (
        !existsSync(`${process.env.PROJECT_STORAGE_PATH}/${data.id}/index.js`)
      ) {
        exec(`rm -rf ./${data.id}`);
        this.createproject(data);
      }
      writeFileSync(
        `./${data.id}/index.js`,
        `
      
      `,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
