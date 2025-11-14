import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ticket Checklist',
  description: 'Team organizational checklist tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
