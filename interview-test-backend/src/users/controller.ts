import { type Request, type Response } from 'express';
import { PrismaClient, type User } from '@prisma/client';
import { ZodError, z } from 'zod';

import getZodErrors from '../utils/getZodErrors';

import { type FilterProps, usersService } from './service';

const prisma = new PrismaClient();

const listUsers = async (req: Request, res: Response): Promise<Response> => {
  const { search, from, to } = req.query as unknown as FilterProps;

  const users = await usersService.listUsers({
    search,
    from,
    to,
  });

  return res.json(users);
};

const createUser = async (req: Request, res: Response): Promise<Response> => {
  const schema = z.object({
    name: z
      .string({ required_error: 'Digite um nome' })
      .min(1, 'Digite o nome'),
    email: z
      .string({ required_error: 'Digite um e-mail' })
      .email('Digite um e-mail válido'),
    phone: z
      .string({ required_error: 'Forneça um telefone' })
      .min(10, 'Digite um telefone válido')
      .max(11, 'Digite um telefone válido'),
  });

  const { name, email, phone } = req.body as unknown as z.infer<typeof schema>;

  try {
    schema.parse({
      name,
      email,
      phone,
    });

    const emailAlreadyUsed = await usersService.findByEmail(email);
    const phoneAlreadyUsed = await usersService.findByPhone(phone);

    if (emailAlreadyUsed || phoneAlreadyUsed) {
      return res.status(409).json({
        path: emailAlreadyUsed ? 'email' : 'phone',
        message: `${emailAlreadyUsed ? 'E-mail' : 'Telefone'} já foi utilizado`,
      });
    }

    const user = await usersService.createUser({
      name,
      email,
      phone,
    });

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = getZodErrors(error);

      return res.status(400).json({
        message: 'Erro de validação',
        errors,
      });
    }

    return res.json({
      message: 'Erro desconhecido',
      description: 'Tente novamente mais tarde',
    });
  }
};

const showUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: 'Id não fornecido',
    });
  }

  const user = await usersService.findById(id);

  if (!user) {
    return res.status(404).json({
      message: 'Usuário não encontrado',
    });
  }

  return res.status(200).json(user);
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, email, phone } = req.body as unknown as Partial<User>;

  if (!id) {
    return res.status(400).json({
      message: 'Id não fornecido',
    });
  }

  const user = await usersService.findById(id);

  if (!user) {
    return res.status(404).json({
      message: 'Usuário não encontrado',
    });
  }

  const emailAlreadyUsed = await usersService.verifyIfEmailAlreadyExists(
    user.email,
    email
  );

  const phoneAlreadyUsed = await usersService.verifyIfPhoneAlreadyExists(
    user.phone,
    phone
  );

  if (emailAlreadyUsed || phoneAlreadyUsed) {
    return res.status(409).json({
      path: emailAlreadyUsed ? 'email' : 'phone',
      message: `${emailAlreadyUsed ? 'E-mail' : 'Telefone'} já foi utilizado`,
    });
  }

  const updatedUser = await usersService.updateUser(id, {
    name,
    email,
    phone,
  });

  return res.status(200).json(updatedUser);
};

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: 'Usuário não encontrado',
    });
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      deleted_at: new Date(),
    },
  });

  return res.status(204).send();
};

const usersController = {
  listUsers,
  createUser,
  showUser,
  updateUser,
  deleteUser,
};

export { usersController };
