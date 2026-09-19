import { getTranslations } from "next-intl/server";
import { getSite, telUrl, whatsappUrl } from "@/lib/site";
import { PhoneIcon, WhatsAppIcon } from "../icons";

/** Fixed bottom bar on phones: most enquiries come by phone. */
export async function MobileBar() {
  const t = await getTranslations("common");
  const site = await getSite();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-px border-t border-white/10 bg-teal-950 pb-[env(safe-area-inset-bottom)] md:hidden">
      <a
        href={telUrl(site.phones[0].e164)}
        className="flex min-h-14 items-center justify-center gap-2 bg-gold-400 font-semibold text-teal-950"
      >
        <PhoneIcon size={20} /> {t("callNow")}
      </a>
      <a
        href={whatsappUrl(site.whatsapp, t("whatsappMessage"))}
        target="_blank"
        rel="noopener"
        className="flex min-h-14 items-center justify-center gap-2 bg-whatsapp font-semibold text-white"
      >
        <WhatsAppIcon size={20} /> {t("whatsapp")}
      </a>
    </div>
  );
}
