import { writeFileSync } from 'fs';
import { Project } from '../interface';
import { PROJECT_STORAGE_PATH } from 'config';
import { expressServer } from '../snippets';

export const createExpressServer = (data: Project) => {
  writeFileSync(
    `${PROJECT_STORAGE_PATH}/${data.id}/index.js`,
    expressServer(data.schema.routes),
  );
};
