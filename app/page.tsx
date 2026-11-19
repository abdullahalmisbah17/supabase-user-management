import CreateUser from "@/components/ui/pages/home/createUser";
import UserCrud from "@/components/ui/pages/home/userCrud";

import {
  Users,
  Database,
  UserPlus,
  Pencil,
  Trash2,
  LayoutDashboard,
} from "lucide-react";

const technologies = [
  "Next.js",
  "TypeScript",
  "Supabase",
  "Tailwind CSS",
  "shadcn/ui",
];

export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl space-y-8 p-4 py-8 md:p-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-xl md:p-10">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-6 flex items-center gap-2">
              <LayoutDashboard size={25} />
              <span className="font-semibold tracking-wide">
                USER DASHBOARD
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              User Management System
            </h1>

            <h2 className="mt-3 text-xl font-semibold text-blue-300 md:text-2xl">
              Built with Next.js & Supabase
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
              A simple and modern dashboard to manage users. Create, read,
              update and delete user information with Supabase database
              integration.
            </p>

            {/* Technologies */}
            <div className="mt-6 flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 right-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        </section>

        {/* Overview Section */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your database operations easily.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard
              title="User Management"
              description="Manage all registered users."
              icon={<Users size={23} />}
            />

            <OverviewCard
              title="Create Users"
              description="Add new users to database."
              icon={<UserPlus size={23} />}
            />

            <OverviewCard
              title="Update Users"
              description="Edit existing user information."
              icon={<Pencil size={23} />}
            />

            <OverviewCard
              title="Delete Users"
              description="Remove users from database."
              icon={<Trash2 size={23} />}
            />
          </div>
        </section>

        {/* Database Actions */}
        <section>
          <CreateUser />
        </section>

        {/* User CRUD */}
        <section>
          <UserCrud />
        </section>

        {/* Footer */}
        <footer className="border-t pt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Database size={17} />
            User Management Dashboard
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Built with Next.js, TypeScript & Supabase.
          </p>
        </footer>
      </div>
    </div>
  );
}

// Overview Card Component
function OverviewCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-slate-950">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        {icon}
      </div>

      <h3 className="font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
