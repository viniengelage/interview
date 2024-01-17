import api from './api';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateUserDTO extends Partial<CreateUserDTO> {
  id: string;
}

export interface FilterProps {
  search?: string;
  from?: Date;
  to?: Date;
}

const listUsers = async (filters?: FilterProps) => {
  const params = new Map();

  if (filters && filters.search) {
    params.set('search', filters.search);
  }

  if (filters && filters.from) {
    params.set('from', filters.from);
  }

  if (filters && filters.from) {
    params.set('to', filters.to);
  }

  const { data } = await api.get('/users', {
    params: Object.fromEntries(params),
  });

  return data;
};

const createUser = async ({
  name,
  email,
  phone,
}: CreateUserDTO): Promise<UserProps> => {
  const { data } = await api.post('/users', {
    name,
    email,
    phone,
  });

  return data;
};

const updateUser = async ({
  id,
  name,
  email,
  phone,
}: UpdateUserDTO): Promise<void> => {
  await api.put(`/users/${id}`, {
    name,
    email,
    phone,
  });
};

const deleteUser = async (id: string) => {
  await api.delete(`/users/${id}`);
};

const userService = {
  listUsers,
  createUser,
  deleteUser,
  updateUser,
};

export default userService;
