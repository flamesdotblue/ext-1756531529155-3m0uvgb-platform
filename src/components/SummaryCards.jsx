import { DollarSign, Receipt, Percent, ListChecks } from 'lucide-react'

export default function SummaryCards({ stats, currency }) {
  const cards = [
    {
      label: 'Total Gross',
      value: currency.format(stats.totalGross || 0),
      icon: DollarSign,
      style: 'bg-white border-slate-200',
    },
    {
      label: 'Total Net To You',
      value: currency.format(stats.totalNet || 0),
      icon: Receipt,
      style: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    },
    {
      label: 'Avg Commission Rate',
      value: `${(stats.avgRate || 0).toFixed(2)}%`,
      icon: Percent,
      style: 'bg-white border-slate-200',
    },
    {
      label: 'Deals',
      value: String(stats.count || 0),
      icon: ListChecks,
      style: 'bg-white border-slate-200',
    },
  ]

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-2">
      {cards.map((c, i) => (
        <div key={i} className={`flex items-center gap-3 rounded-2xl border p-4 ${c.style}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <c.icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-slate-500">{c.label}</div>
            <div className="mt-0.5 text-base font-semibold">{c.value}</div>
          </div>
        </div>
      ))}
    </section>
  )
}
