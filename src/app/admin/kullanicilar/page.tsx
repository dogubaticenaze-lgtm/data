import { requireUser } from "@/lib/admin/guard";
import { addUserAction, changePasswordAction, deleteUserAction, resetUserPasswordAction } from "@/lib/admin/actions";
import { readStore } from "@/lib/store";
import { Card, Field, Notice, PageTitle, Shell, SubmitButton } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const me = await requireUser();
  const { ok, err } = await searchParams;
  const store = await readStore({ fresh: true });

  return (
    <Shell username={me.username} current="/admin/kullanicilar">
      <PageTitle title="Kullanıcılar ve şifre" text="Panele girebilecek kişiler. Her kişiye ayrı hesap verin; şifreleri paylaşmayın." />
      <Notice ok={ok} err={err} />

      <Card title="Kendi şifremi değiştir">
        <form action={changePasswordAction} className="grid gap-4 sm:grid-cols-3">
          <Field label="Mevcut şifre" name="current" type="password" autoComplete="current-password" required />
          <Field label="Yeni şifre" name="next" type="password" autoComplete="new-password" required hint="En az 10 karakter; harf ve rakam." />
          <Field label="Yeni şifre (tekrar)" name="confirm" type="password" autoComplete="new-password" required />
          <div className="sm:col-span-3"><SubmitButton>Şifreyi değiştir</SubmitButton></div>
        </form>
      </Card>

      <Card title="Yeni yönetici ekle">
        <form action={addUserAction} className="grid gap-4 sm:grid-cols-3">
          <Field label="Kullanıcı adı" name="username" required hint="Küçük harf, rakam, nokta, tire." />
          <Field label="Şifre" name="password" type="password" autoComplete="new-password" required />
          <Field label="Şifre (tekrar)" name="confirm" type="password" autoComplete="new-password" required />
          <div className="sm:col-span-3"><SubmitButton>Ekle</SubmitButton></div>
        </form>
      </Card>

      <Card title={`Yöneticiler (${store.users.length})`}>
        <ul className="divide-y divide-line">
          {store.users.map((u) => (
            <li key={u.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-teal-950">{u.username}{u.id === me.id ? " (siz)" : ""}</p>
                <p className="text-xs text-muted">Oluşturma: {new Date(u.createdAt).toLocaleDateString("tr-TR")}</p>
              </div>
              {u.id !== me.id && (
                <div className="flex flex-wrap items-end gap-2">
                  <form action={resetUserPasswordAction} className="flex items-end gap-2">
                    <input type="hidden" name="id" value={u.id} />
                    <Field label="Yeni şifre" name="password" type="password" autoComplete="new-password" required />
                    <SubmitButton variant="outline">Sıfırla</SubmitButton>
                  </form>
                  <form action={deleteUserAction}>
                    <input type="hidden" name="id" value={u.id} />
                    <SubmitButton variant="danger">Sil</SubmitButton>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </Shell>
  );
}
