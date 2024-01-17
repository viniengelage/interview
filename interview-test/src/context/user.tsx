import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useDebounce } from 'use-debounce';
import { useMutation, useQuery } from 'react-query';

import userService, {
  CreateUserDTO,
  FilterProps,
  UserProps,
} from '@/services/user';
import dayjs from 'dayjs';

interface ContextProps {
  users: UserProps[];
  createUser(data: CreateUserDTO): Promise<UserProps>;
  updateUser(data: Partial<CreateUserDTO>): Promise<void>;
  deleteUser(id: string): Promise<void>;
  updateFilter(filters?: FilterProps): void;
}

interface RangeDateProps {
  from: Date | undefined;
  to: Date | undefined;
}

const User = createContext<ContextProps>({} as ContextProps);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [rangeDates, setRangeDates] = useState<RangeDateProps>({
    from: undefined,
    to: undefined,
  });

  const [search, setSearch] = useState('');
  const [filterName] = useDebounce(search, 1000);

  const { data: users = [], refetch: getUsers } = useQuery({
    queryKey: ['users', filterName, rangeDates],
    queryFn: async () => {
      return userService.listUsers({
        search: filterName,
        from: rangeDates.from,
        to: rangeDates.to,
      });
    },
  });

  const { mutateAsync: createUser } = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      getUsers();
    },
  });

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: userService.updateUser,
    onSuccess: () => {
      getUsers();
    },
  });

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      getUsers();
    },
  });

  const updateFilter = useCallback((filters?: FilterProps) => {
    setSearch(filters?.search || '');
    setRangeDates({
      from: filters?.from || dayjs().subtract(1, 'days').toDate(),
      to: filters?.to || dayjs().toDate(),
    });
  }, []);

  return (
    <User.Provider
      value={{ users, createUser, updateUser, deleteUser, updateFilter }}
    >
      {children}
    </User.Provider>
  );
};

function useUser() {
  const context = useContext(User);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}

export { UserProvider, useUser };
