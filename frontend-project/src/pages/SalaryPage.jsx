import { useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { api, getCurrentUser } from '../api'

export default function SalaryPage() {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [salaries, setSalaries] = useState([])
  const [selected, setSelected] = useState('')
  const [grossSalary, setGrossSalary] = useState('')
  const [totalDeduction, setTotalDeduction] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const currentUser = getCurrentUser()?.username || 'System'

  const loadData = async () => {
    const [emp, dep, sal] = await Promise.all([
      api('/employees'),
      api('/departments'),
      api('/salaries')
    ])
    setEmployees(emp)
    setDepartments(dep)
    setSalaries(sal)
  }

  useEffect(() => {
    loadData().catch(() => setError('Failed to load salary page data'))
  }, [])

  const selectedEmployee = useMemo(
    () => employees.find((e) => String(e.EmployeeNumber) === String(selected)),
    [employees, selected]
  )
  const selectedDepartment = useMemo(
    () => departments.find((d) => d.DepartmentCode === selectedEmployee?.DepartmentCode),
    [departments, selectedEmployee]
  )
  const parsedGross = Number(grossSalary || 0)
  const parsedDeduction = Number(totalDeduction || 0)
  const netSalary = parsedGross - parsedDeduction
  const invalidNet = parsedDeduction > parsedGross
  const deductionPercentage = parsedGross > 0 ? (parsedDeduction / parsedGross) * 100 : 0

  useEffect(() => {
    if (selectedDepartment) {
      setGrossSalary(String(selectedDepartment.GrossSalary ?? ''))
      setTotalDeduction(String(selectedDepartment.TotalDeduction ?? ''))
    } else {
      setGrossSalary('')
      setTotalDeduction('')
    }
  }, [selectedDepartment])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const body = Object.fromEntries(new FormData(e.target).entries())
    
    if (!body.EmployeeNumber || isNaN(Number(body.EmployeeNumber)) || Number(body.EmployeeNumber) <= 0) {
      setError('Employee Number must be a valid positive number')
      return
    }
    if (typeof body.Month !== 'string' || !/^\d{4}-\d{2}$/.test(body.Month)) {
      setError('Month must be a valid string in YYYY-MM format')
      return
    }
    if (body.GrossSalary === '' || isNaN(Number(body.GrossSalary)) || Number(body.GrossSalary) < 0) {
      setError('Gross Salary must be a valid non-negative number')
      return
    }
    if (body.TotalDeduction === '' || isNaN(Number(body.TotalDeduction)) || Number(body.TotalDeduction) < 0) {
      setError('Total Deduction must be a valid non-negative number')
      return
    }

    body.EmployeeNumber = Number(body.EmployeeNumber)
    body.GrossSalary = Number(body.GrossSalary)
    body.TotalDeduction = Number(body.TotalDeduction)

    if (body.TotalDeduction > body.GrossSalary) {
      setError('Total deduction cannot be greater than gross salary')
      return
    }

    setLoading(true)
    try {
      await api('/salaries/generate', 'POST', body)
      e.target.reset()
      setSelected('')
      setGrossSalary('')
      setTotalDeduction('')
      await loadData()
    } catch (err) {
      setError(err?.error || 'Salary generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Salary">
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/5 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Generate Salary</h2>
                <p className="text-xs font-medium text-slate-400">Process monthly payroll distributions for registered staff.</p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Select Employee</label>
                  <select
                    name="EmployeeNumber"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-slate-700 cursor-pointer"
                    required
                  >
                    <option value="">Choose Staff Member</option>
                    {employees.map((e) => (
                      <option key={e._id} value={e.EmployeeNumber}>
                        {e.EmployeeNumber} - {e.FirstName} {e.LastName} ({e.Position})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Payment Month</label>
                  <input 
                    name="Month" 
                    type="month" 
                    max={new Date().toISOString().slice(0, 7)}
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-semibold text-slate-700 cursor-pointer" 
                    required 
                  />
                </div>
              </div>

              {/* Department read-only view */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Department Code</label>
                  <input
                    value={selectedEmployee?.DepartmentCode || ''}
                    readOnly
                    placeholder="Auto-filled"
                    className="w-full px-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Gross Base Salary</label>
                  <input
                    name="GrossSalary"
                    type="number"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(e.target.value)}
                    placeholder="Gross Salary"
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Deduction Cap</label>
                  <input
                    name="TotalDeduction"
                    type="number"
                    value={totalDeduction}
                    onChange={(e) => setTotalDeduction(e.target.value)}
                    placeholder="Deduction"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 ${
                      invalidNet 
                        ? 'bg-rose-50 border-rose-200 text-rose-600' 
                        : 'bg-slate-50/50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
              </div>

              {error ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600">
                  <svg className="w-4.5 h-4.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              ) : null}

              <button 
                type="submit"
                disabled={loading || invalidNet || !selectedEmployee}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {loading ? 'Processing...' : 'Save & Issue Salary'}
              </button>
            </form>
          </div>

          {/* Right Column: Net Salary Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Net Calculation Preview */}
            <div className={`rounded-2xl border p-6 md:p-8 shadow-xl shadow-slate-900/5 backdrop-blur-md transition-all ${
              invalidNet 
                ? 'bg-rose-50/70 border-rose-100 text-rose-950' 
                : 'bg-white/80 border-slate-100 text-slate-900'
            }`}>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider mb-4 border ${
                invalidNet 
                  ? 'bg-rose-100 text-rose-700 border-rose-200' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                {invalidNet ? 'Calculation Error' : 'Net Disbursal Estimation'}
              </span>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Net Salary</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-3xl font-black tracking-tight ${invalidNet ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {netSalary.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-slate-400 uppercase">RWF</span>
                  </div>
                </div>

                {/* Progress bar visualizer */}
                {!invalidNet && parsedGross > 0 ? (
                  <div className="space-y-1.5 pt-2">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-emerald-500"
                        style={{ width: `${100 - deductionPercentage}%` }}
                      />
                      <div 
                        className="h-full bg-rose-400"
                        style={{ width: `${deductionPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <span>Net: {(100 - deductionPercentage).toFixed(0)}%</span>
                      <span>Deduction: {deductionPercentage.toFixed(0)}%</span>
                    </div>
                  </div>
                ) : null}

                <div className="pt-4 border-t border-slate-100 divide-y divide-slate-50 text-xs font-semibold">
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Gross Base</span>
                    <span className="text-slate-700 font-bold">{parsedGross.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Deductions</span>
                    <span className={`font-bold ${parsedDeduction > 0 ? 'text-rose-500' : 'text-slate-700'}`}>
                      -{parsedDeduction.toLocaleString()} RWF
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Employee card */}
            {selectedEmployee ? (
              <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl shadow-slate-900/10">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Selected Employee Information</h4>
                <div className="space-y-2.5 text-sm font-semibold text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-xs uppercase">Full Name</span>
                    <span className="text-white font-bold">{selectedEmployee.FirstName} {selectedEmployee.LastName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-xs uppercase">Position</span>
                    <span className="text-slate-200">{selectedEmployee.Position}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-xs uppercase">Staff Phone</span>
                    <span className="text-slate-200 font-mono">{selectedEmployee.Telephone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-xs uppercase">Gender Group</span>
                    <span className="text-slate-200">{selectedEmployee.Gender}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Generated Payroll Reports Table */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/5 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-700">
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Historical Disbursals</h2>
              <p className="text-xs font-medium text-slate-400">Complete records of all processed payroll distributions.</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 text-left font-bold">Employee #</th>
                  <th className="px-4 py-3.5 text-left font-bold">Employee Name</th>
                  <th className="px-4 py-3.5 text-left font-bold">Payment Month</th>
                  <th className="px-4 py-3.5 text-left font-bold">Gross Salary</th>
                  <th className="px-4 py-3.5 text-left font-bold">Total Reductions</th>
                  <th className="px-4 py-3.5 text-left font-bold">Recorded By</th>
                  <th className="px-4 py-3.5 text-right font-bold">Net Distributed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 bg-white">
                {salaries.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400 font-bold text-xs">{s.EmployeeNumber}</td>
                    <td className="px-4 py-3.5 text-slate-900 font-bold">{s.EmployeeName || '-'}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                        {s.Month}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{Number(s.GrossSalary).toLocaleString()} RWF</td>
                    <td className="px-4 py-3.5 text-rose-500 font-medium">-{Number(s.TotalDeduction).toLocaleString()} RWF</td>
                    <td className="px-4 py-3.5 text-slate-500 font-bold uppercase text-xs">{s.recordedBy || currentUser}</td>
                    <td className="px-4 py-3.5 text-right text-emerald-600 font-bold">{Number(s.NetSalary).toLocaleString()} RWF</td>
                  </tr>
                ))}

                {salaries.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-400 font-medium" colSpan={7}>
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>No historical transactions recorded.</span>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
