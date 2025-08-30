import { useEffect, useMemo, useState } from 'react'
import { DollarSign, Percent, Plus } from 'lucide-react'

const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' })

export default function DealForm({ onAddDeal }) {
  const [values, setValues] = useState({
    date: new Date().toISOString().slice(0, 10),
    clientName: '',
    address: '',
    salePrice: '',
    commissionRate: 3,
    brokerSplit: 20,
    fees: 0,
  })

  const computed = useMemo(() => {
    const salePrice = Number(values.salePrice || 0)
    const commissionRate = Number(values.commissionRate || 0)
    const brokerSplit = Number(values.brokerSplit || 0)
    const fees = Number(values.fees || 0)

    const grossCommission = (salePrice * commissionRate) / 100
    const brokerCommission = (grossCommission * brokerSplit) / 100
    const agentGross = grossCommission - brokerCommission
    const netToAgent = agentGross - fees

    return { grossCommission, brokerCommission, agentGross, netToAgent }
  }, [values])

  useEffect(() => {
    // ensure numeric fields never hold NaN
    const sanitize = (v) => (v === '' || isNaN(Number(v)) ? '' : v)
    setValues((prev) => ({
      ...prev,
      salePrice: sanitize(prev.salePrice),
      commissionRate: sanitize(prev.commissionRate),
      brokerSplit: sanitize(prev.brokerSplit),
      fees: sanitize(prev.fees),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: name === 'clientName' || name === 'address' ? value : value.replace(/[^0-9.]/g, '') }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!values.clientName || !values.address || !values.salePrice) return
    onAddDeal({
      ...values,
      salePrice: Number(values.salePrice || 0),
      commissionRate: Number(values.commissionRate || 0),
      brokerSplit: Number(values.brokerSplit || 0),
      fees: Number(values.fees || 0),
    })
    setValues((v) => ({ ...v, clientName: '', address: '', salePrice: '', fees: 0 }))
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">New Deal</h2>
        <span className="text-xs text-slate-500">Calculate and save a commission</span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="col-span-1">
          <label className="mb-1 block text-xs font-medium text-slate-600">Closing Date</label>
          <input
            type="date"
            name="date"
            value={values.date}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="col-span-1">
          <label className="mb-1 block text-xs font-medium text-slate-600">Client Name</label>
          <input
            type="text"
            name="clientName"
            value={values.clientName}
            onChange={handleChange}
            placeholder="Jane Smith"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-600">Property Address</label>
          <input
            type="text"
            name="address"
            value={values.address}
            onChange={handleChange}
            placeholder="123 Main St, City, ST"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="col-span-1">
          <label className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-600">
            Sale Price <DollarSign className="h-3.5 w-3.5" />
          </label>
          <input
            type="text"
            name="salePrice"
            inputMode="decimal"
            value={values.salePrice}
            onChange={handleChange}
            placeholder="450000"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="col-span-1">
          <label className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-600">
            Commission Rate % <Percent className="h-3.5 w-3.5" />
          </label>
          <input
            type="text"
            name="commissionRate"
            inputMode="decimal"
            value={values.commissionRate}
            onChange={handleChange}
            placeholder="3"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="col-span-1">
          <label className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-600">
            Broker Split %
          </label>
          <input
            type="text"
            name="brokerSplit"
            inputMode="decimal"
            value={values.brokerSplit}
            onChange={handleChange}
            placeholder="20"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="col-span-1">
          <label className="mb-1 block text-xs font-medium text-slate-600">Fees (flat)</label>
          <input
            type="text"
            name="fees"
            inputMode="decimal"
            value={values.fees}
            onChange={handleChange}
            placeholder="250"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <PreviewItem label="Gross Commission" value={currency.format(Math.max(0, computed.grossCommission))} />
            <PreviewItem label="Broker Commission" value={currency.format(Math.max(0, computed.brokerCommission))} />
            <PreviewItem label="Agent Gross" value={currency.format(Math.max(0, computed.agentGross))} />
            <PreviewItem label="Net To Agent" value={currency.format(Math.max(0, computed.netToAgent))} highlight />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 mt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              setValues({ date: new Date().toISOString().slice(0, 10), clientName: '', address: '', salePrice: '', commissionRate: 3, brokerSplit: 20, fees: 0 })
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" /> Save Deal
          </button>
        </div>
      </form>
    </section>
  )
}

function PreviewItem({ label, value, highlight = false }) {
  return (
    <div className={`rounded-xl border ${highlight ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50'} p-3`}>
      <div className={`text-[10px] uppercase tracking-wide ${highlight ? 'text-white/80' : 'text-slate-500'}`}>{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  )
}
