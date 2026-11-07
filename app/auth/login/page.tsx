import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <main className="flex min-h-[calc(100svh-68px)] w-full items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
