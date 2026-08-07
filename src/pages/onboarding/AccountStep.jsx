export default function AccountStep({ username, setUsername, email, setEmail, password, setPassword, error }) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2">Create your account</h2>
          <p className="text-white/40 text-sm">First, let's set up your login — everything else comes next.</p>
        </div>
  
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-1.5 block">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl glass p-3 text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-emerald/50"
              placeholder="your_username"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl glass p-3 text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-emerald/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl glass p-3 text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-emerald/50"
              placeholder="At least 8 characters"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </div>
    )
  }