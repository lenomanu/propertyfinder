"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Clock,
  Landmark,
  Hourglass,
  UserCog,
  Users,
  MessageSquare,
  CalendarDays,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  KeyRound,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Properties", href: "/admin/properties", icon: Building2, badge: 24 },
  { label: "Pending Properties", href: "/admin/properties/pending", icon: Clock },
  { label: "Agencies", href: "/admin/agencies", icon: Landmark },
  { label: "Pending Agencies", href: "/admin/agencies/pending", icon: Hourglass },
  { label: "Agents", href: "/admin/agents", icon: UserCog },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare, badge: 3 },
  { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-slate-200">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <KeyRound size={18} />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Harborview</p>
            <p className="text-xs text-slate-500">Realty Admin</p>
          </div>
        )}
      </div>

      {/* Logged-in user */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
            AM
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">Ava Morgan</p>
            <p className="truncate text-xs text-slate-500">Broker Admin</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon, badge }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-emerald-600" />
              )}
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="flex-1 text-left">{label}</span>}
              {!collapsed && badge && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-slate-800"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}