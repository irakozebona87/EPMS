export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md text-slate-400 border-t border-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
        <div>&copy; {new Date().getFullYear()} B&M Developers</div>
        <div className="text-slate-500">Employee Payroll System v1.0</div>
      </div>
    </footer>
  )
}
