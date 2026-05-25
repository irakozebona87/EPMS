import { useState } from 'react'
import Layout from '../components/Layout'
import { api, getCurrentUser } from '../api'

export default function ReportsPage() {
  const [reportData, setReportData] = useState(null)
  const [reportType, setReportType] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const currentUser = getCurrentUser()?.username || 'System'

  const monthly = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const month = new FormData(e.target).get('month')
    try {
      const data = await api(`/reports/monthly/${encodeURIComponent(month)}`)
      setReportType('monthly')
      setReportData(data)
    } catch (err) {
      setReportData(null)
      setError(err?.error || 'Failed to load monthly report')
    } finally {
      setLoading(false)
    }
  }

  const byDepartment = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.target)
    const code = form.get('departmentCode')
    const month = form.get('month')
    const q = month ? `?month=${encodeURIComponent(month)}` : ''
    try {
      const data = await api(`/reports/department/${encodeURIComponent(code)}${q}`)
      setReportType('department')
      setReportData(data)
    } catch (err) {
      setReportData(null)
      setError(err?.error || 'Failed to load department report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Reports">
      <div className="space-y-8">
        {/* Two Forms (Side-by-side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Report Selector */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/5 p-6">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Monthly Analysis</h2>
                <p className="text-xs font-semibold text-slate-400">Generate report spanning all active payroll transactions.</p>
              </div>
            </div>

            <form onSubmit={monthly} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Select Month</label>
                <input 
                  name="month" 
                  type="month" 
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-slate-700 cursor-pointer" 
                  required 
                />
              </div>
              <button className="w-full py-2.5 bg-gradient-to-r from-slate-900 to-slate-950 hover:from-black hover:to-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Monthly Report
              </button>
            </form>
          </div>

          {/* Department Report Selector */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/5 p-6">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Department Metrics</h2>
                <p className="text-xs font-semibold text-slate-400">Filter reports by organizational code and time month.</p>
              </div>
            </div>

            <form onSubmit={byDepartment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Dept Code</label>
                  <input 
                    name="departmentCode" 
                    placeholder="e.g. ADMS / ST / MC" 
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-slate-700 placeholder:text-slate-400" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Select Month</label>
                  <input 
                    name="month" 
                    type="month" 
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-slate-700 cursor-pointer" 
                    required 
                  />
                </div>
              </div>
              <button className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Department Report
              </button>
            </form>
          </div>

          {error ? (
            <div className="md:col-span-2 flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600">
              <svg className="w-4.5 h-4.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          ) : null}
        </div>

        {/* Report Output Panel */}
        {loading ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 p-12 text-center text-slate-400 font-semibold shadow-xl">
            Synthesizing report records...
          </div>
        ) : reportData ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/5 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-700">
                  <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Generated Report Results</h2>
                  <p className="text-xs font-medium text-slate-400">Structured payroll and distribution totals for target scope.</p>
                </div>
              </div>

              {/* Print action */}
              <button 
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Report
              </button>
            </div>

            {/* Quick report widgets */}
            {reportType === 'monthly' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Info label="Report Scope" value={reportData.month} type="slate" />
                <Info label="Staff Disbursed" value={`${reportData.totalEmployeesPaid} paid`} type="indigo" />
                <Info label="Gross Expenditure" value={`${Number(reportData?.totals?.totalGross || 0).toLocaleString()} RWF`} type="slate" />
                <Info label="Net Disbursed" value={`${Number(reportData?.totals?.totalNet || 0).toLocaleString()} RWF`} type="emerald" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Info label="Department" value={reportData.departmentCode} type="indigo" />
                <Info label="Report Scope" value={reportData.month} type="slate" />
                <Info label="Staff Paid Count" value={`${reportData.totalPayrollRecords} records`} type="slate" />
                <Info label="Net Distributed" value={`${Number(reportData.totalNetPaid || 0).toLocaleString()} RWF`} type="emerald" />
              </div>
            )}

            {/* Structured Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-100 mt-6">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5 text-left font-bold">Employee #</th>
                    <th className="px-4 py-3.5 text-left font-bold">Employee Name</th>
                    <th className="px-4 py-3.5 text-left font-bold">Month Scope</th>
                    <th className="px-4 py-3.5 text-left font-bold">Gross Salary</th>
                    <th className="px-4 py-3.5 text-left font-bold">Deductions</th>
                    <th className="px-4 py-3.5 text-left font-bold">Recorded By</th>
                    <th className="px-4 py-3.5 text-left font-bold">Net Salary</th>
                    {reportType === 'department' ? <th className="px-4 py-3.5 text-right font-bold">Payout Flag</th> : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 bg-white">
                  {(reportData.payrolls || []).map((r) => (
                    <tr key={r._id || `${r.EmployeeNumber}-${r.EmployeeName}`} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-4 py-3.5 text-slate-400 font-bold text-xs">{r.EmployeeNumber}</td>
                      <td className="px-4 py-3.5 text-slate-900 font-bold">{r.EmployeeName || '-'}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                          {r.Month}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{Number(r.GrossSalary).toLocaleString()} RWF</td>
                      <td className="px-4 py-3.5 text-rose-500 font-medium">-{Number(r.TotalDeduction).toLocaleString()} RWF</td>
                      <td className="px-4 py-3.5 text-slate-500 font-bold uppercase text-xs">{r.recordedBy || currentUser}</td>
                      <td className="px-4 py-3.5 text-emerald-600 font-bold">{Number(r.NetSalary).toLocaleString()} RWF</td>
                      {reportType === 'department' ? (
                        <td className="px-4 py-3.5 text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            r.paymentStatus === 'Paid' || Number(r.NetSalary) > 0
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                            {r.paymentStatus || 'Paid'}
                          </span>
                        </td>
                      ) : null}
                    </tr>
                  ))}

                  {(!reportData.payrolls || reportData.payrolls.length === 0) ? (
                    <tr>
                      <td className="px-4 py-8 text-center text-slate-400 font-medium" colSpan={reportType === 'department' ? 7 : 6}>
                        <div className="flex flex-col items-center justify-center gap-2">
                          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                          <span>No transaction records found matching active report parameters.</span>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  )
}

function Info({ label, value, type }) {
  const styles = {
    slate: 'bg-slate-50 border-slate-200/60 text-slate-900',
    indigo: 'bg-indigo-50/50 border-indigo-100/60 text-indigo-900',
    emerald: 'bg-emerald-50/50 border-emerald-100/60 text-emerald-900',
  }

  return (
    <div className={`rounded-xl border p-4 shadow-sm flex flex-col justify-between ${styles[type] || styles.slate}`}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{label}</span>
      <span className="text-sm font-black tracking-tight leading-none break-all">{value}</span>
    </div>
  )
}
