"use client";

import { createClient } from "@/utils/supabase/client";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { Button } from "@/components/ui/button";

import {
  Users,
  UserPlus,
  Trash2,
  Pencil,
  X,
  Loader2,
  Mail,
  UserRound,
  RefreshCw,
} from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UserCrud() {
  const db = useMemo(() => createClient(), []);

  const [users, setUsers] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch users from Supabase
  const fetchUsers = useCallback(async () => {
    return await db.from("users").select("*").order("id", { ascending: false });
  }, [db]);

  // Refresh users manually
  const getData = useCallback(async () => {
    setFetching(true);
    setMessage("");

    try {
      const { data, error } = await fetchUsers();

      if (error) {
        setMessage(error.message);
        return;
      }

      setUsers((data ?? []) as User[]);
    } catch {
      setMessage("Something went wrong while fetching users.");
    } finally {
      setFetching(false);
    }
  }, [fetchUsers]);

  // Initial data fetching
  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      try {
        const { data, error } = await fetchUsers();

        if (ignore) return;

        if (error) {
          setMessage(error.message);
        } else {
          setUsers((data ?? []) as User[]);
        }
      } catch {
        if (!ignore) {
          setMessage("Something went wrong while fetching users.");
        }
      } finally {
        if (!ignore) {
          setFetching(false);
        }
      }
    }

    loadUsers();

    return () => {
      ignore = true;
    };
  }, [fetchUsers]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
    });

    setEditId(null);
  };

  // Create and Update user
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (editId !== null) {
        // Update user
        const { data, error } = await db
          .from("users")
          .update(formData)
          .eq("id", editId)
          .select()
          .single();

        if (error) {
          setMessage(error.message);
          return;
        }

        setUsers((prev) =>
          prev.map((user) => (user.id === editId ? (data as User) : user)),
        );

        resetForm();
        setMessage("User updated successfully!");
        return;
      }

      // Create user
      const { data, error } = await db
        .from("users")
        .insert([formData])
        .select()
        .single();

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data) {
        setUsers((prev) => [data as User, ...prev]);

        resetForm();
        setMessage("User created successfully!");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (id: number) => {
    const isConfirmed = confirm("Are you sure you want to delete this user?");

    if (!isConfirmed) return;

    setMessage("");

    try {
      const { error } = await db.from("users").delete().eq("id", id);

      if (error) {
        setMessage(error.message);
        return;
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));

      setMessage("User deleted successfully!");

      if (editId === id) {
        resetForm();
      }
    } catch {
      setMessage("Failed to delete user.");
    }
  };

  // Edit user
  const handleEdit = (user: User) => {
    setEditId(user.id);

    setFormData({
      name: user.name,
      email: user.email,
    });

    setMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Users className="text-blue-600" />
            User Management
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create, update and manage your users.
          </p>
        </div>

        <Button variant="outline" onClick={getData} disabled={fetching}>
          <RefreshCw
            size={16}
            className={`mr-2 ${fetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* User Form */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-950">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950">
            {editId !== null ? <Pencil size={22} /> : <UserPlus size={22} />}
          </div>

          <div>
            <h3 className="text-lg font-bold">
              {editId !== null ? "Update User" : "Create New User"}
            </h3>

            <p className="text-sm text-muted-foreground">
              {editId !== null
                ? `Editing user #${editId}`
                : "Add a new user to your database."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  required
                  minLength={2}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter your name"
                  className="w-full rounded-lg border bg-transparent py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="Enter your email"
                  className="w-full rounded-lg border bg-transparent py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 animate-spin" size={16} />
              ) : editId !== null ? (
                <Pencil className="mr-2" size={16} />
              ) : (
                <UserPlus className="mr-2" size={16} />
              )}

              {editId !== null ? "Update User" : "Create User"}
            </Button>

            {editId !== null && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={loading}
              >
                <X className="mr-2" size={16} />
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-900">
            {message}
          </p>
        )}
      </div>

      {/* User List */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-slate-950">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h3 className="text-lg font-bold">All Users</h3>

            <p className="text-sm text-muted-foreground">
              Manage your registered users.
            </p>
          </div>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {users.length} Users
          </span>
        </div>

        <div className="divide-y">
          {fetching ? (
            <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
              <Loader2 className="animate-spin" />
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="py-14 text-center">
              <Users className="mx-auto mb-3 text-muted-foreground" size={40} />

              <h3 className="font-semibold">No Users Found</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Start by creating your first user.
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col justify-between gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center dark:hover:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h4 className="font-semibold">{user.name}</h4>

                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      User ID: #{user.id}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(user)}
                  >
                    <Pencil size={15} className="mr-1" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={15} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
