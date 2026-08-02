/**
 * Root Layout — wraps every page with the Sidebar.
 * Uses Inter font from Google Fonts via next/font.
 */

import { Inter } from 'next/font/google';
import Sidebar from './components/Sidebar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RecruitFlow AI — Recruitment Intelligence Platform',
  description:
    'AI-powered recruitment platform using Google Gemini for resume parsing, candidate scoring, and job matching.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-slate-50 min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
