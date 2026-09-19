import { getTranslations } from "next-intl/server";

type Step = { title: string; text: string; need: string; time: string };

export async function ProcessSteps({ compact = false }: { compact?: boolean }) {
  const t = await getTranslations("process");
  const tc = await getTranslations("common");
  const steps = t.raw("steps") as Step[];

  return (
    <ol className={`grid gap-4 ${compact ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2"}`}>
      {steps.map((s, i) => (
        <li key={i} className="card flex flex-col">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-950 text-sm font-semibold text-gold-300">
              {i + 1}
            </span>
            <h3 className="text-lg text-teal-950">{s.title}</h3>
          </div>
          {!compact && <p className="mt-3 text-ink-soft">{s.text}</p>}
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="rounded-lg bg-paper px-3 py-2">
              <dt className="font-medium text-teal-900">{tc("youProvide")}</dt>
              <dd className="text-ink-soft">{s.need}</dd>
            </div>
            <div className="rounded-lg bg-paper px-3 py-2">
              <dt className="font-medium text-teal-900">{tc("estimated")}</dt>
              <dd className="text-ink-soft">{s.time}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ol>
  );
}
