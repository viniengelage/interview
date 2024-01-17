import { useUser } from '@/context/user';
import { Trash } from '@phosphor-icons/react/dist/ssr';
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';

interface Props {
  id: string;
}

export default function DeleteUserForm({ id }: Props) {
  const { deleteUser } = useUser();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-red-300 text-red-600 p-4 rounded-md hover:bg-red-400">
          <Trash size={20} weight="thin" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-30 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="flex flex-col gap-4 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title asChild>
            <h3 className="text-lg text-red-500 font-normal text-left">
              Remover usuário
            </h3>
          </Dialog.Title>

          <p className="text-base text-gray-600 text-left font-thin">
            Você tem certeza? Essa ação é irreversível.
          </p>

          <button
            className="p-4 text-slate-500"
            onClick={() => {
              deleteUser(id);
              setIsOpen(false);
            }}
          >
            Continuar
          </button>

          <button
            className="bg-red-300 text-red-500 p-4 rounded-md hover:bg-red-400"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
