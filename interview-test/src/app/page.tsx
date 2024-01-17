'use client';

import dayjs from 'dayjs';

import { useUser } from '@/context/user';
import UpdateUserForm from '@/forms/updateUser';
import DeleteUserForm from '@/forms/deleteUser';
import * as Dialog from '@radix-ui/react-dialog';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { CreateUserDTO } from '@/services/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/input';
import Calendar from 'react-calendar';

import * as Popover from '@radix-ui/react-popover';

import { AxiosError } from 'axios';
import { CalendarX, X } from '@phosphor-icons/react/dist/ssr';

const schema = z.object({
  name: z.string().min(1, 'Digite um nome'),
  email: z.string().email('Digite um e-mail válido'),
  phone: z.string().min(10, 'Digite um telefone válido'),
});

export default function Home() {
  const { users, createUser, updateFilter } = useUser();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateUserDTO>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
    resolver: zodResolver(schema),
  });

  const handleSubmit = useCallback<SubmitHandler<CreateUserDTO>>(
    async (data) => {
      try {
        await createUser(data);

        form.reset();

        setIsOpen(false);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.data.path) {
          form.setError(error.response?.data.path, {
            message: error.response?.data.message,
          });
        }
      }
    },
    [createUser, form]
  );

  return (
    <main className="flex min-h-screen flex-col items-center">
      <header className="w-full bg-purple-500 p-6 flex items-center justify-center">
        <h1 className="text-white text-2xl">Usuários</h1>
      </header>

      <section className="mt-4 flex w-full items-center gap-4 justify-center max-w-screen-md flex-col">
        <div className="flex items-center gap-2">
          <input
            placeholder="Buscar usuário"
            className="p-4 bg-slate-200 rounded-md text-slate-500 w-full"
            onChange={(e) =>
              updateFilter({
                search: e.target.value,
              })
            }
          />

          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="bg-purple-400 p-3 rounded-md text-purple-800">
                <CalendarX size={32} />
              </button>
            </Popover.Trigger>
            <Popover.Anchor />
            <Popover.Portal>
              <Popover.Content>
                <Calendar
                  selectRange
                  onChange={(dates) => {
                    if (Array.isArray(dates)) {
                      updateFilter({
                        from: dates[0] || undefined,
                        to: dates[1] || undefined,
                      });
                    }
                  }}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <button
            className="bg-gray-200 p-3 rounded-md text-gray-600"
            onClick={() => updateFilter({})}
          >
            <X size={32} />
          </button>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex gap-4 items-center justify-between bg-slate-100 rounded-md p-4 w-full"
            >
              <div className="flex flex-col">
                <h3 className="text-xl text-slate-600">{user.name}</h3>
                <span className="text-sm text-slate-600 font-light">
                  Criado em {dayjs(user.created_at).format('DD/MM/YYYY')}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <p className="text-base text-slate-600">{user.email}</p>
                  <p className="text-sm text-slate-600 font-light">
                    {user.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <UpdateUserForm user={user} />
                  <DeleteUserForm id={user.id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
          <Dialog.Trigger asChild>
            <button className="flex items-center w-full bg-green-200 p-4 rounded-md text-center text-green-800 justify-center hover:bg-green-500">
              Adicionar usuário
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="bg-black bg-opacity-30 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="flex flex-col gap-4 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Title asChild>
                <h3 className="text-lg text-purple-800 font-normal text-center">
                  Adicionar novo usuário
                </h3>
              </Dialog.Title>

              <FormProvider {...form}>
                <form
                  className="flex flex-col w-full gap-4"
                  onSubmit={form.handleSubmit(handleSubmit)}
                >
                  <Input name="name" placeholder="Nome" />
                  <Input name="email" placeholder="E-mail" />
                  <Input name="phone" placeholder="Telefone" />

                  <button
                    type="submit"
                    className="p-4 bg-green-300 flex w-full rounded-md text-green-800 justify-center hover:bg-green-500"
                  >
                    {form.formState.isSubmitting ? (
                      <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    ) : (
                      'Adicionar'
                    )}
                  </button>
                </form>
              </FormProvider>

              <Dialog.Close asChild>
                <button className="text-red-400">Cancelar</button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </section>
    </main>
  );
}
