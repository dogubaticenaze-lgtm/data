import { redirect } from "next/navigation";
import { hasAnyAdmin } from "@/lib/auth";
import { setupAction } from "@/lib/admin/actions";
import { Field, Notice, SubmitButton } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function SetupPage({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  if (await hasAnyAdmin()) redirect("/admin/giris");
  const { err } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form action={setupAction} className="w-full max-w-md space-y-4 rounded-card border border-line bg-white p-6 shadow-card">
        <div>
          <p className="eyebrow">İlk kurulum</p>
          <h1 className="mt-1 text-xl text-teal-950">Yönetici hesabı oluşturun</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Bu ekran yalnızca bir kez görünür. Burada belirlediğiniz kullanıcı adı ve şifre ile panele gireceksiniz. Şifreyi güvenli bir yere not edin.
          </p>
        </div>
        <Notice err={err} />
        <Field label="Kullanıcı adı" name="username" autoComplete="username" required hint="Küçük harf, rakam, nokta veya tire; 3-32 karakter." />
        <Field label="Şifre" name="password" type="password" autoComplete="new-password" required hint="En az 10 karakter; en az bir harf ve bir rakam." />
        <Field label="Şifre (tekrar)" name="confirm" type="password" autoComplete="new-password" required />
        <SubmitButton>Hesabı oluştur ve giriş yap</SubmitButton>
      </form>
    </main>
  );
}
