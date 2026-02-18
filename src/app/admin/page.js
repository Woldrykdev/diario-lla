"use client";

export const dynamic = "force-dynamic";

import AdminForm from "@/components/AdminForm";

export default function AdminPage() {
  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-6">Panel Admin</h1>
      <AdminForm />
    </div>
  );
}
