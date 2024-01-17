'use client';

import { Inter } from 'next/font/google';

import { QueryClient, QueryClientProvider } from 'react-query';
import { UserProvider } from '@/context/user';

import './globals.css';
import 'react-calendar/dist/Calendar.css';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <body className={inter.className}>
            <main>{children}</main>
          </body>
        </UserProvider>
      </QueryClientProvider>
    </html>
  );
}
