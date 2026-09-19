import { redirect } from "next/navigation";
import { getCurrentUser, hasAnyAdmin } from "@/lib/auth";

/** Every admin page and action starts here. */
export async function requireUser() {
  if (!(await hasAnyAdmin())) redirect("/admin/kurulum");
  const user = await getCurrentUser();
  if (!user) redirect("/admin/giris");
  return user;
}
