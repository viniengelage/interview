import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import * as Dialog from '@radix-ui/react-dialog';
import Input from '@/components/input';
import { z } from 'zod';
import { useCallback, useState } from 'react';
import { useUser } from '@/context/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserDTO, UserProps } from '@/services/user';
import { Pencil } from '@phosphor-icons/react/dist/ssr';
import { AxiosError } from 'axios';

interface Props {
  user: UserProps;
}

const schema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Digite um nome'),
  email: z.string().email('Digite um e-mail válido'),
  phone: z.string().min(10, 'Digite um telefone válido'),
});

export default function UpdateUserForm({ user }: Props) {
  const { updateUser } = useUser();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateUserDTO>({
    defaultValues: {
      ...user,
    },
    resolver: zodResolver(schema),
  });

  const handleSubmit = useCallback<SubmitHandler<CreateUserDTO>>(
    async (data) => {
      try {
        await updateUser(data);
        setIsOpen(false);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.data.path) {
          form.setError(error.response?.data.path, {
            message: error.response?.data.message,
          });
        }
      }
    },
    [updateUser, form]
  );

  return (
    <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-green-300 text-green-600 rounded-md hover:bg-green-400 p-4">
          <Pencil size={20} weight="thin" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-30 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="flex flex-col gap-4 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title asChild>
            <h3 className="text-lg text-purple-800 font-normal text-center">
              Atualizar usuário
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
                  'Atualizar'
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
  );
}
