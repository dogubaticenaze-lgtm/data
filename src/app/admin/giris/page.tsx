import { redirect } from "next/navigation";
import { getCurrentUser, hasAnyAdmin } from "@/lib/auth";
import { loginAction } from "@/lib/admin/actions";
import { Field, Notice, SubmitButton } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  if (!(await hasAnyAdmin())) redirect("/admin/kurulum");
  if (await getCurrentUser()) redirect("/admin");
  const { err } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form action={loginAction} className="w-full max-w-sm space-y-4 rounded-card border border-line bg-white p-6 shadow-card">
        <div>
          <p className="eyebrow">Doğu Batı</p>
          <h1 className="mt-1 text-xl text-teal-950">Yönetim paneline giriş</h1>
        </div>
        <Notice err={err} />
        <Field label="Kullanıcı adı" name="username" autoComplete="username" required />
        <Field label="Şifre" name="password" type="password" autoComplete="current-password" required />
        <SubmitButton>Giriş yap</SubmitButton>
        <p className="text-xs text-muted">Şifrenizi unuttuysanız başka bir yönetici panelden sıfırlayabilir. Tek yöneticiyseniz kullanım kılavuzundaki &quot;şifre sıfırlama&quot; bölümüne bakın.</p>
      </form>
    </main>
  );
}
