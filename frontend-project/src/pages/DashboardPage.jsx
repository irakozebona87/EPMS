import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

export default function DashboardPage() {
  return (
    <Layout title="EPMS Dashboard">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-8 md:p-10 shadow-xl border border-indigo-950/40 mb-8">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
          <svg className="w-full h-full text-indigo-400" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
            <path d="M0 100 C 20 80, 40 80, 60 100 C 80 120, 90 110, 100 100 L 100 0 L 0 0 Z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 mb-4 border border-indigo-500/30">
            EPMS Enterprise Platform
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-100 bg-clip-text text-transparent">
            Payroll Control Center
          </h2>
          <p className="text-slate-300 text-sm md:text-base mt-3 leading-relaxed font-medium">
            Manage employee databases, orchestrate accurate monthly salary calculations, and generate compliant analytical reports within a unified, secure system interface.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NavCard
          to="/employees"
          label="Employees Management"
          description="Register active employees, capture critical contact details, and assign structured department codes."
          icon={
            <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          tag="Roster Panel"
        />
        <NavCard
          to="/salary"
          label="Salary Processing"
          description="Automate monthly payroll calculations based on departmental gross salary models and pre-established deductions."
          icon={
            <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          tag="Calculations"
        />
        <NavCard
          to="/departments"
          label="Department Directory"
          description="Inspect corporate organization units, monitor base gross configurations, and manage uniform deduction ceilings."
          icon={
            <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          tag="Directory"
        />
        <NavCard
          to="/reports"
          label="Analytics & Reports"
          description="Audit monthly payouts and structural expenses. Export print-ready reports partitioned by department code."
          icon={
            <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          tag="Reporting"
        />
      </section>
    </Layout>
  )
}

function NavCard({ to, label, description, icon, tag }) {
  return (
    <Link to={to} className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-md shadow-slate-100/50 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100">
            {icon}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">
            {tag}
          </span>
        </div>
        <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600">
          {label}
        </h3>
        <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mt-6 pt-4 border-t border-slate-50">
        <span>Enter Module</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </Link>
  )
}
