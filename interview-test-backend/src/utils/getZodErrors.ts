import { type ZodError } from 'zod';

interface ErrorProps {
  path: string | number;
  message: string;
  code: string;
}

export default function getZodErrors(errors: ZodError): ErrorProps[] {
  const formatedErrors: ErrorProps[] = [];

  errors.issues.map((error) =>
    formatedErrors.push({
      path: error.path[0],
      message: error.message,
      code: error.code,
    })
  );

  return formatedErrors;
}
