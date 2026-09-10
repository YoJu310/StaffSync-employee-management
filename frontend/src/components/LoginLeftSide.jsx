

const LoginLeftSide = () => {
  return (
    <div className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 relative overflow-hidden border-r border-slate-800">

        <div className="absolute -top-30 -left-30 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
            
        <div className="relative z-10 flex flex-col items-start justify-center p-12 lg:p-20 w-full h-full">
            <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">
                StaffSync
            </p>
            <h1 className="text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">Employee <br /> Management System</h1>
            <p className="text-slate-300 text-lg max-w-md leading-relaxed">Manage employees, attendance, leave requests, and payroll from one centralized platform.</p>
        </div>
    </div>
  )
}

export default LoginLeftSide
