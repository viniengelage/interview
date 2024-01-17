import { Router } from 'express';

import { usersController } from './controller';

const usersRoute = Router();

usersRoute.get('/', usersController.listUsers);
usersRoute.post('/', usersController.createUser);
usersRoute.get('/:id', usersController.showUser);
usersRoute.put('/:id', usersController.updateUser);
usersRoute.delete('/:id', usersController.deleteUser);

export { usersRoute };
