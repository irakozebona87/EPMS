import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../api'

export default function EmployeesPage() {
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState('')
  const [selectedDepartmentCode, setSelectedDepartmentCode] = useState('')
  const [editingId, setEditingId] = useState('')
  const [editForm, setEditForm] = useState({})
  const [loading, setLoading] = useState(false)

  const loadPageData = async () => {
    const [dep, emp] = await Promise.all([
      api('/departments'),
      api('/employees')
    ])
    setDepartments(dep)
    setEmployees(emp)
  }

  useEffect(() => {
    loadPageData().catch(() => setError('Failed to load employee page data'))
  }, [])

  const selectedDepartment = departments.find((d) => d.DepartmentCode === selectedDepartmentCode)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const form = new FormData(e.target)
    const body = Object.fromEntries(form.entries())
    const nameRegex = /^[A-Za-z]{3,}$/

    if (typeof body.FirstName !== 'string' || !nameRegex.test(body.FirstName.trim())) {
      setError('First name must be a string of at least 3 letters containing no spaces or symbols')
      return
    }
    if (typeof body.LastName !== 'string' || !nameRegex.test(body.LastName.trim())) {
      setError('Last name must be a string of at least 3 letters containing no spaces or symbols')
      return
    }
    if (typeof body.Position !== 'string' || !nameRegex.test(body.Position.trim())) {
      setError('Position must be a string of at least 3 letters containing no spaces or symbols')
      return
    }
    if (typeof body.Address !== 'string' || body.Address.trim() === '') {
      setError('Address must be a valid non-empty string')
      return
    }
    if (typeof body.Telephone !== 'string' || !/^(072|073|078|079)\d{7}$/.test(body.Telephone)) {
      setError('Invalid telephone number format (must start with 072, 073, 078, or 079 followed by 7 digits)')
      return
    }
    if (typeof body.Gender !== 'string' || !['Male', 'Female'].includes(body.Gender)) {
      setError('Gender must be a valid string (Male or Female)')
      return
    }
    if (typeof body.DepartmentCode !== 'string' || body.DepartmentCode.trim() === '') {
      setError('Department Code must be a valid non-empty string')
      return
    }

    const hired = new Date(body.HiredDate)
    const now = new Date()
    const sameYear = hired.getUTCFullYear() === now.getUTCFullYear()
    const sameMonth = hired.getUTCMonth() === now.getUTCMonth()
    if (Number.isNaN(hired.getTime()) || !sameYear || !sameMonth) {
      setError('Hired date must be a valid date in the current month and year only')
      return
    }

    setLoading(true)
    try {
      await api('/employees', 'POST', body)
      e.target.reset()
      setSelectedDepartmentCode('')
      await loadPageData()
    } catch (err) {
      setError(err?.error || 'Failed to save employee')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (emp) => {
    setError('')
    setEditingId(emp._id)
    setEditForm({
      FirstName: emp.FirstName || '',
      LastName: emp.LastName || '',
      Position: emp.Position || '',
      Address: emp.Address || '',
      Telephone: emp.Telephone || '',
      Gender: emp.Gender || 'Male',
      HiredDate: emp.HiredDate || '',
      DepartmentCode: emp.DepartmentCode || ''
    })
  }

  const saveEdit = async () => {
    setError('')
    const nameRegex = /^[A-Za-z]{3,}$/

    if (typeof editForm.FirstName !== 'string' || !nameRegex.test(editForm.FirstName.trim())) {
      setError('First name must be a string of at least 3 letters containing no spaces or symbols')
      return
    }
    if (typeof editForm.LastName !== 'string' || !nameRegex.test(editForm.LastName.trim())) {
      setError('Last name must be a string of at least 3 letters containing no spaces or symbols')
      return
    }
    if (typeof editForm.Position !== 'string' || !nameRegex.test(editForm.Position.trim())) {
      setError('Position must be a string of at least 3 letters containing no spaces or symbols')
      return
    }
    if (typeof editForm.Address !== 'string' || editForm.Address.trim() === '') {
      setError('Address must be a valid non-empty string')
      return
    }
    if (typeof editForm.Telephone !== 'string' || !/^(072|073|078|079)\d{7}$/.test(editForm.Telephone)) {
      setError('Invalid telephone number format (must start with 072, 073, 078, or 079 followed by 7 digits)')
      return
    }
    if (typeof editForm.Gender !== 'string' || !['Male', 'Female'].includes(editForm.Gender)) {
      setError('Gender must be a valid string (Male or Female)')
      return
    }
    if (typeof editForm.DepartmentCode !== 'string' || editForm.DepartmentCode.trim() === '') {
      setError('Department Code must be a valid non-empty string')
      return
    }

    const hired = new Date(editForm.HiredDate)
    const now = new Date()
    const sameYear = hired.getUTCFullYear() === now.getUTCFullYear()
    const sameMonth = hired.getUTCMonth() === now.getUTCMonth()
    if (Number.isNaN(hired.getTime()) || !sameYear || !sameMonth) {
      setError('Hired date must be a valid date in the current month and year only')
      return
    }

    try {
      await api(`/employees/${editingId}`, 'PUT', editForm)
      setEditingId('')
      setEditForm({})
      await loadPageData()
    } catch (err) {
      setError(err?.error || 'Failed to update employee')
    }
  }

  const removeEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return
    try {
      await api(`/employees/${id}`, 'DELETE')
      if (editingId === id) {
        setEditingId('')
        setEditForm({})
      }
      await loadPageData()
    } catch (err) {
      setError(err?.error || 'Failed to delete employee')
    }
  }

  return (
    <Layout title="Employees">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Registration Form (1/3 Width) */}
        <div className="lg:col-span-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/5 p-6 sticky lg:top-36">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Register Employee</h2>
              <p className="text-xs font-medium text-slate-400">Save employee details to secure database.</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">First Name</label>
              <input 
                name="FirstName" 
                minLength={3} 
                pattern="[A-Za-z]{3,}" 
                title="At least 3 letters, no spaces or symbols" 
                placeholder="Divine" 
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Last Name</label>
              <input 
                name="LastName" 
                minLength={3} 
                pattern="[A-Za-z]{3,}" 
                title="At least 3 letters, no spaces or symbols" 
                placeholder="Irakoze" 
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Position</label>
              <input 
                name="Position" 
                minLength={3} 
                pattern="[A-Za-z]{3,}" 
                title="At least 3 letters, no spaces or symbols" 
                placeholder="Engineer" 
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Telephone</label>
              <input 
                name="Telephone" 
                placeholder="0781234567" 
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Hired Date</label>
              <input 
                name="HiredDate" 
                type="date" 
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-slate-700" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Department</label>
              <select
                name="DepartmentCode"
                value={selectedDepartmentCode}
                onChange={(e) => setSelectedDepartmentCode(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-slate-700 cursor-pointer"
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d._id} value={d.DepartmentCode}>{d.DepartmentCode}</option>)}
              </select>
            </div>

            {selectedDepartment ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs text-indigo-700 font-semibold">
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Department Staff: <strong>{selectedDepartment.totalEmployees || 0} registered</strong></span>
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Address</label>
              <input 
                name="Address" 
                placeholder="Kigali, Rwanda" 
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Gender</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input type="radio" name="Gender" value="Male" className="accent-indigo-600 w-4.5 h-4.5 cursor-pointer" required /> Male
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input type="radio" name="Gender" value="Female" className="accent-indigo-600 w-4.5 h-4.5 cursor-pointer" required /> Female
                </label>
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
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {loading ? 'Saving...' : 'Save Employee'}
            </button>
          </form>
        </div>

        {/* Database Roster (2/3 Width) */}
        <div className="lg:col-span-8 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/5 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-700">
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Registered Employees</h2>
              <p className="text-xs font-medium text-slate-400">Database registry containing all registered staff members.</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 text-left font-bold"># ID</th>
                  <th className="px-4 py-3.5 text-left font-bold">Name</th>
                  <th className="px-4 py-3.5 text-left font-bold">Position</th>
                  <th className="px-4 py-3.5 text-left font-bold">Dept</th>
                  <th className="px-4 py-3.5 text-left font-bold">Telephone</th>
                  <th className="px-4 py-3.5 text-left font-bold">Hired Date</th>
                  <th className="px-4 py-3.5 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 bg-white">
                {employees.map((e) => (
                  <tr key={e._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400 font-bold text-xs">{e.EmployeeNumber}</td>
                    
                    <td className="px-4 py-3.5">
                      {editingId === e._id ? (
                        <div className="flex gap-2">
                          <input 
                            className="border border-slate-200 rounded-lg px-2 py-1 w-24 text-xs font-semibold bg-slate-50" 
                            value={editForm.FirstName || ''} 
                            onChange={(ev) => setEditForm((p) => ({ ...p, FirstName: ev.target.value }))} 
                          />
                          <input 
                            className="border border-slate-200 rounded-lg px-2 py-1 w-24 text-xs font-semibold bg-slate-50" 
                            value={editForm.LastName || ''} 
                            onChange={(ev) => setEditForm((p) => ({ ...p, LastName: ev.target.value }))} 
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-bold">{e.FirstName} {e.LastName}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{e.Gender}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      {editingId === e._id ? (
                        <input 
                          className="border border-slate-200 rounded-lg px-2 py-1 w-24 text-xs font-semibold bg-slate-50" 
                          value={editForm.Position || ''} 
                          onChange={(ev) => setEditForm((p) => ({ ...p, Position: ev.target.value }))} 
                        />
                      ) : e.Position}
                    </td>

                    <td className="px-4 py-3.5">
                      {editingId === e._id ? (
                        <select 
                          className="border border-slate-200 rounded-lg px-2 py-1 w-24 text-xs font-semibold bg-slate-50" 
                          value={editForm.DepartmentCode || ''} 
                          onChange={(ev) => setEditForm((p) => ({ ...p, DepartmentCode: ev.target.value }))}
                        >
                          <option value="">Dept</option>
                          {departments.map((d) => <option key={d._id} value={d.DepartmentCode}>{d.DepartmentCode}</option>)}
                        </select>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-extrabold bg-indigo-50 text-indigo-600 border border-indigo-100">
                          {e.DepartmentCode}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">
                      {editingId === e._id ? (
                        <input 
                          className="border border-slate-200 rounded-lg px-2 py-1 w-32 text-xs font-semibold bg-slate-50" 
                          value={editForm.Telephone || ''} 
                          onChange={(ev) => setEditForm((p) => ({ ...p, Telephone: ev.target.value }))} 
                        />
                      ) : e.Telephone}
                    </td>

                    <td className="px-4 py-3.5 text-slate-500 font-medium text-xs">
                      {editingId === e._id ? (
                        <input 
                          type="date" 
                          className="border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold bg-slate-50" 
                          value={editForm.HiredDate || ''} 
                          onChange={(ev) => setEditForm((p) => ({ ...p, HiredDate: ev.target.value }))} 
                        />
                      ) : e.HiredDate}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      {editingId === e._id ? (
                        <div className="flex justify-end gap-1.5">
                          <button 
                            type="button" 
                            onClick={saveEdit} 
                            className="bg-indigo-600 text-white rounded-lg px-2.5 py-1 text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-sm transition-colors"
                          >
                            Save
                          </button>
                          <button 
                            type="button" 
                            onClick={() => { setEditingId(''); setEditForm({}) }} 
                            className="bg-slate-100 text-slate-600 rounded-lg px-2.5 py-1 text-xs font-bold hover:bg-slate-200 cursor-pointer transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1.5">
                          <button 
                            type="button" 
                            onClick={() => startEdit(e)} 
                            className="bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg px-2.5 py-1 text-xs font-bold transition-all border border-slate-200/50 hover:border-indigo-100 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button 
                            type="button" 
                            onClick={() => removeEmployee(e._id)} 
                            className="bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg px-2.5 py-1 text-xs font-bold transition-all border border-slate-200/50 hover:border-rose-100 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                
                {employees.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-400 font-medium" colSpan={7}>
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>No employees registered yet.</span>
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
