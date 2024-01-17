import express from 'express';
import cors from 'cors';

import { usersRoute } from './users/routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', usersRoute);

app.listen(3333, () => 'Servidor iniciado na porta 3333');
