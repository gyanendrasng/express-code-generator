import { Route } from '../interface';

export const expressServer = (routes: Route[]) => `
const express = require('express');

${routes
  .map(
    (route) =>
      `import ${route.name}Router from './src/routes/${route.name}.js';`,
  )
  .join('\n')}


const app = express();

${routes.map((route) => {
  const routeVariable = `${route.name}Router`;
  return `app.use('/${route.name}',${routeVariable});`;
})}

app.listen(3000, () => {console.log("server started at port 3000")});
`;
