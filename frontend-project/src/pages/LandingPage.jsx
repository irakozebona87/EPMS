import { Link } from 'react-router-dom'
import { token } from '../api'
import Layout from '../components/Layout'

const modules = [
  {
    label: 'Employee Registry',
    description: 'Register staff, assign department codes, and keep contact details organized for payroll work.',
    value: '01',
  },
  {
    label: 'Salary Issuing',
    description: 'Generate monthly salary records with gross salary, deductions, net salary, and recorded user details.',
    value: '02',
  },
  {
    label: 'Department Control',
    description: 'View department salary structures and deduction limits from one clear directory.',
    value: '03',
  },
  {
    label: 'Reports',
    description: 'Present payroll outputs with readable records that are ready for review and decision making.',
    value: '04',
  },
]

export default function LandingPage() {
  const loggedIn = !!token.get()
  const primaryTarget = loggedIn ? '/dashboard' : '/login'

  return (
    <Layout title="Welcome">
      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-100 bg-white/90 p-8 text-center shadow-xl shadow-slate-900/5 backdrop-blur-md md:p-12">
          <span className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-indigo-600">
            System Overview
          </span>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
            Employee Payroll Management System
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base font-medium leading-7 text-slate-500 md:text-lg">
            This system helps an organization manage employee records, department salary settings, monthly salary issuing, and payroll reports from one secure web application.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={primaryTarget}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              {loggedIn ? 'Open Dashboard' : 'Open System'}
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-extrabold text-slate-700 transition hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Create Account
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => (
            <div key={module.label} className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-md shadow-slate-100/70 backdrop-blur-md">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-xs font-black text-indigo-600">
                {module.value}
              </span>
              <h2 className="mt-4 text-lg font-black text-slate-950">{module.label}</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{module.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-100 bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10 md:p-8">
          <h2 className="text-2xl font-black tracking-tight">Presentation Summary</h2>
          <p className="mt-3 max-w-4xl text-sm font-medium leading-6 text-slate-300">
            The main workflow is simple: create or sign in to an HR account, register employees, review their department settings, issue monthly salaries, and use reports to confirm payroll records.
          </p>
        </section>
      </div>
    </Layout>
  )
}
