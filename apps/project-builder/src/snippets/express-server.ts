import { Route } from '../interface';

export const expressServer = (routes: Route[]) => `
const express = require('express');

${routes.forEach((route) => {
  return `import ${route.name}Router from 'src/routes/${route.name}';`;
})}

const app = express();

${routes.forEach((route) => {
  return `app.use(${route.name}Router)`;
})}

app.listen(3000, () => {console.log("server started at port 3000")});
`;
