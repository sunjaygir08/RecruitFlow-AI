'use client';

/**
 * Sidebar — Fixed left navigation.
 * Uses usePathname to highlight the active route.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Upload,
  Briefcase,
  BarChart2,
  Calendar,
  Zap,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/candidates', label: 'Candidates', icon: Users },
  { href: '/candidates/upload', label: 'Upload Resume', icon: Upload },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/interviews', label: 'Interviews', icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside
      style={{ width: 'var(--sidebar-width)', minHeight: '100vh' }}
      className="bg-slate-900 text-white flex flex-col shrink-0"
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">RecruitFlow AI</h1>
        </div>
        <p className="text-xs text-slate-500 pl-10">Internship Project 2026</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive(href)
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2 px-3">
          <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <span className="text-xs text-indigo-400 font-bold">HR</span>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-300">Recruiter</p>
            <p className="text-xs text-slate-500">admin@recruitflow.ai</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
