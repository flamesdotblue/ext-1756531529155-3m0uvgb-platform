import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import DealForm from './components/DealForm'
import DealList from './components/DealList'
import SummaryCards from './components/SummaryCards'

const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' })

function computeDeal(values) {
  const salePrice = Number(values.salePrice || 0)
  const commissionRate = Number(values.commissionRate || 0)
  const brokerSplit = Number(values.brokerSplit || 0)
  const fees = Number(values.fees || 0)

  const grossCommission = (salePrice * commissionRate) / 100
  const brokerCommission = (grossCommission * brokerSplit) / 100
  const agentGross = grossCommission - brokerCommission
  const netToAgent = agentGross - fees

  return {
    ...values,
    salePrice,
    commissionRate,
    brokerSplit,
    fees,
    grossCommission,
    brokerCommission,
    agentGross,
    netToAgent,
  }
}

function App() {
  const [deals, setDeals] = useState(() => {
    try {
      const raw = localStorage.getItem('realtor_commission_deals')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('realtor_commission_deals', JSON.stringify(deals))
  }, [deals])

  const addDeal = (formValues) => {
    const computed = computeDeal(formValues)
    const deal = { id: crypto.randomUUID(), ...computed }
    setDeals((d) => [deal, ...d])
  }

  const removeDeal = (id) => {
    setDeals((d) => d.filter((x) => x.id !== id))
  }

  const stats = useMemo(() => {
    const count = deals.length
    const totalGross = deals.reduce((sum, d) => sum + d.grossCommission, 0)
    const totalNet = deals.reduce((sum, d) => sum + d.netToAgent, 0)
    const avgRate = deals.length
      ? deals.reduce((sum, d) => sum + d.commissionRate, 0) / deals.length
      : 0
    return { count, totalGross, totalNet, avgRate }
  }, [deals])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 pb-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DealForm onAddDeal={addDeal} />
          </div>
          <div className="lg:col-span-1">
            <SummaryCards stats={stats} currency={currency} />
          </div>
        </div>

        <div className="mt-10">
          <DealList deals={deals} onRemove={removeDeal} currency={currency} />
        </div>
      </main>
    </div>
  )
}

export default App
