import { LoginForm } from "@/components/admin/LoginForm";

export default function Page() {
  return (
    <div className="mx-auto max-w-sm rounded-foto border border-linea bg-papel p-8">
      <h1 className="text-2xl font-light">Panel de citas</h1>
      <p className="mt-2 text-sm text-acero">Solo para el equipo de la óptica.</p>
      <LoginForm />
    </div>
  );
}
