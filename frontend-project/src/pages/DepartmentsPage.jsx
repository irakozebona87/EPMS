import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../api'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/departments')
      .then(setDepartments)
      .catch(() => setDepartments([]))
      .finally(() => setLoading(false))
  }, [])

  // Calculate totals for quick overview dashboard stats
  const totalDepartmentsCount = departments.length
  const aggregateBaseGross = departments.reduce((acc, curr) => acc + Number(curr.GrossSalary || 0), 0)
  const averageDeduction = totalDepartmentsCount > 0 
    ? departments.reduce((acc, curr) => acc + Number(curr.TotalDeduction || 0), 0) / totalDepartmentsCount 
    : 0

  return (
    <Layout title="Department">
      <div className="space-y-8">
        {/* Quick Summary Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Units</span>
              <span className="text-2xl font-black text-slate-900">{totalDepartmentsCount}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Aggregate Base Gross</span>
              <span className="text-2xl font-black text-slate-900">{aggregateBaseGross.toLocaleString()} <span className="text-xs font-bold text-slate-400">RWF</span></span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-emerald-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Avg Unit Deduction Limit</span>
              <span className="text-2xl font-black text-slate-900">{averageDeduction.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-xs font-bold text-slate-400">RWF</span></span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-rose-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Directory Listing Grid */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-700">
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Department Directory</h2>
              <p className="text-xs font-medium text-slate-400">Organization units with established financial configurations.</p>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 font-medium">Loading units...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((d) => {
                const gross = Number(d.GrossSalary || 0)
                const deduction = Number(d.TotalDeduction || 0)
                const netBase = gross - deduction
                const percentageOfDeduction = gross > 0 ? (deduction / gross) * 100 : 0
                
                return (
                  <div key={d._id} className="group bg-slate-50/50 rounded-2xl p-6 border border-slate-200/50 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {d.DepartmentCode}
                      </span>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        Net: {netBase.toLocaleString()} RWF
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600">
                      {d.DepartmentName}
                    </h3>

                    {/* Progress Bar visualizer */}
                    <div className="mt-5 space-y-1.5">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-indigo-500" style={{ width: `${100 - percentageOfDeduction}%` }} />
                        <div className="h-full bg-rose-400" style={{ width: `${percentageOfDeduction}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <span>Net Allocation ({(100 - percentageOfDeduction).toFixed(0)}%)</span>
                        <span>Deductions ({percentageOfDeduction.toFixed(0)}%)</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/50 grid grid-cols-2 gap-4 text-xs font-semibold">
                      <div>
                        <span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Gross Base</span>
                        <span className="text-slate-800 font-extrabold text-sm">{gross.toLocaleString()} RWF</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Max Deductions</span>
                        <span className="text-rose-500 font-extrabold text-sm">{deduction.toLocaleString()} RWF</span>
                      </div>
                    </div>
                  </div>
                )
              })}

              {departments.length === 0 ? (
                <div className="md:col-span-2 py-8 text-center text-slate-400 font-medium">
                  No department records found.
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
