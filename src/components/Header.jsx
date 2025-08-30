import { Home, Calculator } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Commission Pro</h1>
            <p className="text-xs text-slate-500">Real estate commission calculator for Realtors</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Calculator className="h-5 w-5 text-slate-600" />
          <span className="text-sm text-slate-600">Fast, accurate, and transparent</span>
        </div>
      </div>
    </header>
  )
}
