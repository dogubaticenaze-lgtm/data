import type { CaseStatus } from "@/lib/store";

export const statusLabels: Record<CaseStatus, string> = {
  received: "Dosya açıldı",
  documents: "Belgeler hazırlanıyor",
  preparation: "Cenaze hazırlanıyor",
  consulate: "Konsolosluk ve nakil belgeleri",
  flight: "Uçuş planlandı / yolda",
  delivered: "Teslim edildi",
};

export const statusOptions = (Object.keys(statusLabels) as CaseStatus[]).map((v) => ({ value: v, label: statusLabels[v] }));
