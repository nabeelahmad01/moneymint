import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.875rem' }}>💰</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }} className="gradient-text">MoneyMint</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/login" style={{ color: '#d1d5db', padding: '0.5rem 1rem' }} className="hover:text-white">
              Login
            </Link>
            <Link href="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', paddingTop: '8rem', paddingBottom: '5rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', top: '5rem', left: '2.5rem', width: '24rem', height: '24rem', background: 'rgba(0, 212, 255, 0.3)', borderRadius: '50%', filter: 'blur(120px)' }}></div>
          <div style={{ position: 'absolute', bottom: '5rem', right: '2.5rem', width: '24rem', height: '24rem', background: 'rgba(147, 51, 234, 0.3)', borderRadius: '50%', filter: 'blur(120px)' }}></div>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '48rem', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '9999px', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.3)', marginBottom: '1.5rem' }}>
              <span className="animate-pulse">🔥</span>
              <span style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500 }}>$2 Welcome Bonus for New Users</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.1 }}>
              Complete Tasks.<br />
              <span className="gradient-text">Earn Rewards.</span>
            </h1>

            <p style={{ fontSize: '1.25rem', color: '#9ca3af', marginBottom: '2rem', maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto' }}>
              Join thousands of users earning real money by completing simple online tasks.
              Withdraw instantly to Binance!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                <Link href="/signup" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                  Start Earning Now 🚀
                </Link>
                <a href="#download" className="btn btn-secondary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                  Download App 📱
                </a>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto', marginTop: '3rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)' }}>10K+</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Active Users</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#4ade80' }}>$50K+</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Paid Out</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#c084fc' }}>100+</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Daily Tasks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 5vw, 2.25rem)', fontWeight: 700, marginBottom: '1rem' }}>Why Choose MoneyMint?</h2>
            <p style={{ color: '#9ca3af', maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto' }}>The most trusted platform for earning money online</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', transition: 'all 0.3s' }}>
              <div style={{ width: '4rem', height: '4rem', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.875rem' }}>🎯</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Simple Tasks</h3>
              <p style={{ color: '#9ca3af' }}>Watch videos, complete surveys, and do simple tasks anyone can do</p>
            </div>

            <div className="card" style={{ textAlign: 'center', transition: 'all 0.3s' }}>
              <div style={{ width: '4rem', height: '4rem', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.875rem' }}>⚡</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Instant Payouts</h3>
              <p style={{ color: '#9ca3af' }}>Withdraw your earnings directly to Binance within 24 hours</p>
            </div>

            <div className="card" style={{ textAlign: 'center', transition: 'all 0.3s' }}>
              <div style={{ width: '4rem', height: '4rem', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.875rem' }}>👥</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Referral Bonus</h3>
              <p style={{ color: '#9ca3af' }}>Earn $2 for every friend you invite. Unlimited referrals!</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem', background: '#0d0d14' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 5vw, 2.25rem)', fontWeight: 700, marginBottom: '1rem' }}>How It Works</h2>
            <p style={{ color: '#9ca3af' }}>Start earning in just 3 simple steps</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '56rem', marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '5rem', height: '5rem', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Account</h3>
              <p style={{ color: '#9ca3af' }}>Sign up for free in less than a minute</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '5rem', height: '5rem', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Complete Tasks</h3>
              <p style={{ color: '#9ca3af' }}>Watch videos, take surveys, and more</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '5rem', height: '5rem', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Get Paid</h3>
              <p style={{ color: '#9ca3af' }}>Withdraw to Binance instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Tasks */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 5vw, 2.25rem)', fontWeight: 700, marginBottom: '1rem' }}>Available Tasks</h2>
            <p style={{ color: '#9ca3af' }}>Multiple ways to earn every day</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', maxWidth: '48rem', marginLeft: 'auto', marginRight: 'auto' }}>
            {[
              { icon: '🎬', title: 'Watch Videos', reward: '$0.50+' },
              { icon: '📋', title: 'Complete Surveys', reward: '$1.00+' },
              { icon: '📅', title: 'Daily Check-in', reward: '$0.25' },
              { icon: '📱', title: 'Social Share', reward: '$0.75' },
              { icon: '👥', title: 'Invite Friends', reward: '$2.00' },
              { icon: '⭐', title: 'App Reviews', reward: '$1.50' },
            ].map((task, index) => (
              <div key={index} className="card card-hover" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{task.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{task.title}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 700 }}>{task.reward}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" style={{ paddingTop: '5rem', paddingBottom: '5rem', background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))' }}>
        <div className="container">
          <div style={{ maxWidth: '48rem', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
            <div style={{ fontSize: '3.75rem', marginBottom: '1.5rem' }}>📱</div>
            <h2 style={{ fontSize: 'clamp(1.875rem, 5vw, 2.25rem)', fontWeight: 700, marginBottom: '1rem' }}>Download Our App</h2>
            <p style={{ color: '#9ca3af', marginBottom: '2rem', maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto' }}>
              Get the MoneyMint app on your Android device for the best experience.
              Complete tasks anytime, anywhere!
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <a
                href="/MoneyMint.apk"
                download
                className="btn btn-primary"
                style={{ fontSize: '1.125rem', padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}
              >
                <span style={{ fontSize: '1.5rem' }}>📥</span>
                Download APK
                <span style={{ fontSize: '0.875rem', opacity: 0.75 }}>(Android)</span>
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '24rem', marginLeft: 'auto', marginRight: 'auto', fontSize: '0.875rem', color: '#9ca3af' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>✅</div>
                <div>Free Download</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🔒</div>
                <div>Safe & Secure</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📶</div>
                <div>5MB Size</div>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '1.5rem' }}>
              * Allow installation from unknown sources in your phone Profile
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 5vw, 2.25rem)', fontWeight: 700, marginBottom: '1rem' }}>What Users Say</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '64rem', marginLeft: 'auto', marginRight: 'auto' }}>
            {[
              { name: 'Ahmed K.', text: 'Made $50 in my first week! The tasks are easy and payments are fast.', rating: 5 },
              { name: 'Sara M.', text: 'Best earning app I have used. Referral bonus is amazing!', rating: 5 },
              { name: 'Ali R.', text: 'Legit platform. Withdrew twice already with no issues.', rating: 5 },
            ].map((review, index) => (
              <div key={index} className="card">
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem' }}>
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} style={{ color: '#facc15' }}>⭐</span>
                  ))}
                </div>
                <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>&quot;{review.text}&quot;</p>
                <p style={{ fontWeight: 700, color: 'var(--primary)' }}>{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem', background: 'linear-gradient(90deg, rgba(0, 212, 255, 0.2), rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2))' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.875rem, 5vw, 2.25rem)', fontWeight: 700, marginBottom: '1rem' }}>Ready to Start Earning?</h2>
          <p style={{ color: '#d1d5db', marginBottom: '2rem', maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto' }}>
            Join MoneyMint today and start making money from your phone. It&apos;s free to join!
          </p>
          <Link href="/signup" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
            Create Free Account 💰
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem', borderTop: '1px solid #374151' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💰</span>
              <span style={{ fontWeight: 700 }} className="gradient-text">MoneyMint</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', color: '#9ca3af', fontSize: '0.875rem' }}>
              <Link href="/login" style={{ color: '#9ca3af' }} className="hover:text-white">Login</Link>
              <Link href="/signup" style={{ color: '#9ca3af' }} className="hover:text-white">Sign Up</Link>
              <a href="#download" style={{ color: '#9ca3af' }} className="hover:text-white">Download</a>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>© 2026 MoneyMint. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
