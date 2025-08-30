import { Trash2, MapPin, User } from 'lucide-react'

export default function DealList({ deals, onRemove, currency }) {
  if (!deals.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No deals yet. Add your first one using the form above.
      </section>
    )
  }

  return (
    <section className="space-y-3">
      {deals.map((d) => (
        <article key={d.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">{new Date(d.date).toLocaleDateString()}</span>
              <span className="flex items-center gap-1 text-sm text-slate-700"><User className="h-4 w-4" /> {d.clientName}</span>
              <span className="flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-4 w-4" /> {d.address}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Kpi label="Sale Price" value={currency.format(d.salePrice)} />
              <Kpi label="Rate" value={`${d.commissionRate}%`} />
              <Kpi label="Gross Commission" value={currency.format(d.grossCommission)} />
              <Kpi label="Net To Agent" value={currency.format(d.netToAgent)} emphasize />
            </div>
            <Disclosure>
              <div className="grid grid-cols-2 gap-3 pt-3 sm:grid-cols-4">
                <Kpi label="Broker Split" value={`${d.brokerSplit}%`} subtle />
                <Kpi label="Broker Commission" value={currency.format(d.brokerCommission)} subtle />
                <Kpi label="Agent Gross" value={currency.format(d.agentGross)} subtle />
                <Kpi label="Fees" value={currency.format(d.fees)} subtle />
              </div>
            </Disclosure>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => onRemove(d.id)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}

function Kpi({ label, value, emphasize = false, subtle = false }) {
  const base = 'rounded-xl border p-3'
  const style = emphasize
    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
    : subtle
    ? 'border-slate-200 bg-slate-50 text-slate-700'
    : 'border-slate-200 bg-white text-slate-900'

  return (
    <div className={`${base} ${style}`}>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  )
}

function Disclosure({ children }) {
  return (
    <details className="mt-2">
      <summary className="cursor-pointer select-none text-xs text-slate-600 hover:text-slate-900">Show breakdown</summary>
      {children}
    </details>
  )
}
