// "use client";

// import { Button } from "@/components/ui/button";
// import { createClient } from "@/utils/supabase/client";
// import { Users } from "lucide-react";

// export default function CreateUser() {
//   const db = createClient();
//   const handleClick = async () => {
//     const { error, data } = await db.from("users").insert([
//       { name: "abdullah", email: "abd@email.com" },
//       { name: "abdullah", email: "abde@email.com" },
//     ]);
//     console.log(error, data);
//   };

//   const deleteUserHandler = async () => {
//     const { data } = await db.from("users").delete().eq("id", 16);
//     console.log(data);
//   };

//   return (
//     <div>
//       <Button onClick={handleClick}> Add user </Button>
//       <Button onClick={deleteUserHandler}> Delete user </Button>
//     </div>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Database, Loader2, Trash2, UserPlus } from "lucide-react";

export default function CreateUser() {
  const db = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await db.from("users").insert([
      { name: "abdullah", email: "abd@email.com" },
      { name: "abdullah", email: "abde@email.com" },
    ]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Two users created successfully!");
    }

    setLoading(false);
  };

  const deleteUserHandler = async () => {
    const isConfirmed = confirm("Are you sure you want to delete user ID 16?");

    if (!isConfirmed) return;

    setLoading(true);
    setMessage("");

    const { error } = await db.from("users").delete().eq("id", 16);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("User deleted successfully!");
    }

    setLoading(false);
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-950">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950">
          <Database size={24} />
        </div>

        <div>
          <h2 className="text-xl font-bold">Database Actions</h2>
          <p className="text-sm text-muted-foreground">
            Manage your Supabase users
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border p-4">
          <UserPlus className="mb-3 text-blue-600" size={25} />

          <h3 className="font-semibold">Create Users</h3>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Insert two demo users into your database.
          </p>

          <Button onClick={handleClick} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 animate-spin" size={16} />
            ) : (
              <UserPlus className="mr-2" size={16} />
            )}
            Add Users
          </Button>
        </div>

        <div className="rounded-xl border p-4">
          <Trash2 className="mb-3 text-red-500" size={25} />

          <h3 className="font-semibold">Delete User</h3>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Delete a user from the database using ID 16.
          </p>

          <Button
            variant="destructive"
            onClick={deleteUserHandler}
            disabled={loading}
            className="w-full"
          >
            <Trash2 className="mr-2" size={16} />
            Delete User
          </Button>
        </div>
      </div>

      {message && (
        <p className="mt-4 rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-900">
          {message}
        </p>
      )}
    </div>
  );
}
