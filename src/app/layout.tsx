import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'AI CareerOS — Intelligent Job Discovery & Career Workflow Platform',
  description:
    'Stop searching. Start building your career. Automated job discovery from approved career portals, AI-powered skill fit analysis, and actionable 7-day interview roadmaps.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] text-[#0B1220] flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
