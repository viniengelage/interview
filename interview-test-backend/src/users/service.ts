import { PrismaClient, type User } from '@prisma/client';
import dayjs from 'dayjs';

interface UserProps {
  name: string;
  email: string;
  phone: string;
}

export interface FilterProps {
  search?: string;
  from?: Date;
  to?: Date;
}

const prisma = new PrismaClient();

const listUsers = async ({
  search,
  from,
  to,
}: FilterProps): Promise<User[]> => {
  const fromDate = from ? dayjs(from).toDate() : undefined;
  const toDate = to ? dayjs(to).toDate() : undefined;

  return await prisma.user.findMany({
    where: {
      deleted_at: null,
      name: {
        contains: search,
      },
      created_at: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });
};

const findByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const findByPhone = async (phone: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      phone,
    },
  });
};

const findById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const createUser = async ({ name, email, phone }: UserProps): Promise<User> => {
  return await prisma.user.create({
    data: {
      name,
      email,
      phone,
    },
  });
};

const updateUser = async (
  id: string,
  { name, email, phone }: Partial<UserProps>
): Promise<User | null> => {
  const [, updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        phone,
      },
    }),
    prisma.user.findUnique({
      where: {
        id,
      },
    }),
  ]);

  return updatedUser;
};

const verifyIfEmailAlreadyExists = async (
  currentEmail: string,
  requestEmail?: string
): Promise<boolean> => {
  if (requestEmail && requestEmail !== currentEmail) {
    const emailAlreadyExists = await prisma.user.findUnique({
      where: {
        email: requestEmail,
      },
    });

    return !!emailAlreadyExists;
  }

  return false;
};

const verifyIfPhoneAlreadyExists = async (
  currentPhone: string,
  requestPhone?: string
): Promise<boolean> => {
  if (requestPhone && requestPhone !== currentPhone) {
    const phoneAlreadyExists = await prisma.user.findUnique({
      where: {
        phone: requestPhone,
      },
    });

    return !!phoneAlreadyExists;
  }

  return false;
};

const usersService = {
  createUser,
  updateUser,
  listUsers,
  findByEmail,
  findByPhone,
  findById,
  verifyIfEmailAlreadyExists,
  verifyIfPhoneAlreadyExists,
};

export { usersService };
