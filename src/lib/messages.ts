import tr from "../../messages/tr.json";
import en from "../../messages/en.json";
import ru from "../../messages/ru.json";
import ar from "../../messages/ar.json";
import fa from "../../messages/fa.json";
import de from "../../messages/de.json";
import type { AppLocale } from "@/i18n/routing";

/** The shipped (un-overridden) message files, keyed by locale. */
export const baseMessages: Record<AppLocale, typeof tr> = { tr, en, ru, ar, fa, de };
