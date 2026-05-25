import Header from './Header'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ title, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-white to-indigo-50/20 flex flex-col">
      <Header title="Employee Payroll Management System" />
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-36 pb-20">{children}</main>
      <Footer />
    </div>
  )
}
