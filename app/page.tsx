import { UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>MCA CRM Dashboard</h1>
        <UserButton />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#666' }}>Total Deals</p>
          <h2 style={{ margin: '0.5rem 0 0' }}>0</h2>
        </div>
        <div style={{ background: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#666' }}>Active Merchants</p>
          <h2 style={{ margin: '0.5rem 0 0' }}>0</h2>
        </div>
        <div style={{ background: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#666' }}>Funded This Month</p>
          <h2 style={{ margin: '0.5rem 0 0' }}>$0</h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
  <a href="/merchants" style={{ padding: '0.75rem 1.5rem', background: '#000', color: '#fff', borderRadius: '6px', textDecoration: 'none' }}>View Merchants</a>
  <a href="/deals" style={{ padding: '0.75rem 1.5rem', background: '#000', color: '#fff', borderRadius: '6px', textDecoration: 'none' }}>View Deals</a>
  <a href="/funders" style={{ padding: '0.75rem 1.5rem', background: '#000', color: '#fff', borderRadius: '6px', textDecoration: 'none' }}>View Funders</a>
</div>
    </div>
  )
}