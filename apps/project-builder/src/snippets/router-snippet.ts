import { capitalizeFirstLetter } from '../helpers';

export const routerSnippet = (routerName: string) => `
import { Router } from 'express';
import  ${routerName}Controller  from '../controllers/${routerName}';

const router = Router();

router.post('/', ${routerName}Controller.create${capitalizeFirstLetter(
  routerName,
)});

router.get('/', ${routerName}Controller.get${capitalizeFirstLetter(
  routerName,
)});

router.get('/:id', ${routerName}Controller.get${capitalizeFirstLetter(
  routerName,
)}ById);

router.put('/:id', ${routerName}Controller.update${capitalizeFirstLetter(
  routerName,
)});

router.delete('/:id', ${routerName}Controller.delete${capitalizeFirstLetter(
  routerName,
)});

export default router;
`;
