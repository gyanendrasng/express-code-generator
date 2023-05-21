import { mkdirSync, writeFileSync } from 'fs';
import { Project } from '../interface';
import { routerSnippet, controllerSnippet } from '../snippets';
import { PROJECT_STORAGE_PATH } from 'config';

const srcFolders = [
  'controllers',
  'middlewares',
  'routes',
  'models',
  'services',
  'utils',
  'config',
  //'interfaces', will be used with typescript support
];

export const createFoldersAndFiler = (data: Project) => {
  mkdirSync(`${PROJECT_STORAGE_PATH}/${data.id}/src`, {
    recursive: true,
  });
  srcFolders.forEach((folder) => {
    mkdirSync(`${PROJECT_STORAGE_PATH}/${data.id}/src/${folder}`, {
      recursive: true,
    });
  });
  createRoutesFiles(data);
  createControllerFiles(data);
};

export const createRoutesFiles = (data: Project) => {
  const routes = data.schema.routes;
  routes.forEach((route) => {
    writeFileSync(
      `${PROJECT_STORAGE_PATH}/${data.id}/src/routes/${route.name}.js`,
      routerSnippet(route.name),
    );
  });
};

export const createControllerFiles = (data: Project) => {
  const controllers = data.schema.routes;
  controllers.forEach((controller) => {
    writeFileSync(
      `${PROJECT_STORAGE_PATH}/${data.id}/src/controllers/${controller.name}.js`,
      controllerSnippet(controller.name),
    );
  });
};
