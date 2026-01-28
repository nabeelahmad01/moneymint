import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">💰</span>
            <span className="text-xl font-bold gradient-text">MoneyMint</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-300 hover:text-white px-4 py-2">
              Login
            </Link>
            <Link href="/signup" className="btn btn-primary py-2 px-4">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 md:pt-52 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="animate-pulse">🔥</span>
              <span className="text-primary text-sm font-medium">Earn up to 300% ROI in 30 Days</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Invest Smart.<br />
              <span className="gradient-text">Earn Daily.</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
              Purchase investment packages and earn daily returns for 30 days.
              Start with as low as $10 and grow your income!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/signup" className="btn btn-primary text-lg px-8 py-4">
                Start Investing Now 🚀
              </Link>
              <a href="#packages" className="btn btn-secondary text-lg px-8 py-4">
                View Packages 💎
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-gray-500 text-sm">Active Investors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">$100K+</div>
                <div className="text-gray-500 text-sm">Paid Out</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">300%</div>
                <div className="text-gray-500 text-sm">Max ROI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 bg-[#0d0d14]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">💎 Investment Packages</h2>
            <p className="text-gray-400">Choose a plan and start earning daily returns</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '🌱', name: 'Starter', price: 10, daily: 0.25, total: 7.50, color: 'green' },
              { icon: '🥈', name: 'Silver', price: 50, daily: 1.25, total: 37.50, color: 'gray' },
              { icon: '🥇', name: 'Gold', price: 100, daily: 2.75, total: 82.50, color: 'yellow', popular: true },
              { icon: '👑', name: 'VIP Elite', price: 500, daily: 12.00, total: 360, color: 'purple' },
              { icon: '💠', name: 'Diamond', price: 1000, daily: 28.00, total: 840, color: 'pink' },
            ].map((pkg, index) => (
              <div key={index} className={`card card-hover text-center relative ${pkg.popular ? 'border-primary' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-black text-xs font-bold rounded-full">
                    POPULAR
                  </div>
                )}
                <div className="text-4xl mb-3">{pkg.icon}</div>
                <h3 className="font-bold text-xl mb-2">{pkg.name}</h3>
                <p className="text-3xl font-bold text-white mb-4">${pkg.price}</p>
                <div className="text-sm text-gray-400 mb-4">
                  <p>Daily: <span className="text-green-400 font-bold">${pkg.daily.toFixed(2)}</span></p>
                  <p>30 Days Total: <span className="text-primary font-bold">${pkg.total}</span></p>
                  <p>ROI: <span className="text-purple-400 font-bold">{((pkg.total / pkg.price) * 100).toFixed(0)}%</span></p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/signup" className="btn btn-primary text-lg px-8 py-4">
              Get Started Now →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400">Start earning in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Deposit Funds</h3>
              <p className="text-gray-400">Add funds to your wallet via Binance</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Purchase Package</h3>
              <p className="text-gray-400">Choose an investment package</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Claim Daily</h3>
              <p className="text-gray-400">Earn returns every day for 30 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#0d0d14]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3">High Returns</h3>
              <p className="text-gray-400">Earn up to 300% ROI on your investment in just 30 days</p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">Fast Payouts</h3>
              <p className="text-gray-400">Withdraw your earnings instantly to Binance</p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-3">Referral Bonus</h3>
              <p className="text-gray-400">Earn $2 for every friend you refer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-6">📱</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Download Our App</h2>
            <p className="text-gray-400 mb-8">
              Get the EarnTask app on your Android device. Invest and earn anytime, anywhere!
            </p>

            <a
              href="/earntask.apk"
              download
              className="btn btn-primary text-lg px-8 py-4 inline-flex items-center gap-3"
            >
              📥 Download APK (Android)
            </a>

            <p className="text-xs text-gray-500 mt-6">
              * Enable &ldquo;Install from unknown sources&rdquo; in settings
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Investors Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Ahmed K.', text: 'Made $200 from Gold package! The daily claims are amazing.', rating: 5 },
              { name: 'Sara M.', text: 'Started with $10 and made $15 in a month. Will invest more!', rating: 5 },
              { name: 'Ali R.', text: 'Best investment platform. Withdrawals are super fast!', rating: 5 },
            ].map((review, index) => (
              <div key={index} className="card">
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4">&quot;{review.text}&quot;</p>
                <p className="font-bold text-primary">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-purple-600/20 to-pink-500/20">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-gray-300 mb-8">
            Join thousands of investors already earning daily returns
          </p>
          <Link href="/signup" className="btn btn-primary text-lg px-10 py-4">
            Create Free Account 💰
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-800">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="font-bold gradient-text">MoneyMint</span>
            </div>
            <div className="flex gap-6 text-gray-400 text-sm">
              <Link href="/login" className="hover:text-white">Login</Link>
              <Link href="/signup" className="hover:text-white">Sign Up</Link>
              <a href="#packages" className="hover:text-white">Packages</a>
              <a href="#download" className="hover:text-white">Download</a>
            </div>
            <p className="text-gray-500 text-sm">© 2026 EarnTask. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
