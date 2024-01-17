import { InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export default function Input({ ...props }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col w-full">
      <input
        {...props}
        {...register(props.name)}
        className="p-4 border-[1px] border-slate-300 rounded-md"
      />
      <p className="mt-2 text-red-500">
        {errors[props.name] ? errors[props.name]?.message?.toString() : null}
      </p>
    </div>
  );
}
