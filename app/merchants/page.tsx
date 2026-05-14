'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Merchant = {
  id: number
  business_name: string
  owner_name: string
  phone: string
  email: string
  industry: string
}

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newMerchant, setNewMerchant] = useState({ businessName: '', ownerName: '', phone: '', email: '', industry: '' })

  useEffect(() => {
    fetch('/api/merchants')
      .then(res => res.json())
      .then(data => { setMerchants(data); setLoading(false) })
  }, [])

  async function addMerchant() {
    if (!newMerchant.businessName) return
    const res = await fetch('/api/merchants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMerchant)
    })
    const saved = await res.json()
    setMerchants([saved, ...merchants])
    setNewMerchant({ businessName: '', ownerName: '', phone: '', email: '', industry: '' })
    setShowForm(false)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#ffffff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Back to Dashboard</Link>
          <h1 style={{ margin: '0.5rem 0 0' }}>Merchants</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.75rem 1.5rem', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          + Add Merchant
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>New Merchant</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input placeholder="Business Name" value={newMerchant.businessName} onChange={e => setNewMerchant({...newMerchant, businessName: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <input placeholder="Owner Name" value={newMerchant.ownerName} onChange={e => setNewMerchant({...newMerchant, ownerName: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <input placeholder="Email" value={newMerchant.email} onChange={e => setNewMerchant({...newMerchant, email: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <input placeholder="Phone" value={newMerchant.phone} onChange={e => setNewMerchant({...newMerchant, phone: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <input placeholder="Industry" value={newMerchant.industry} onChange={e => setNewMerchant({...newMerchant, industry: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
          </div>
          <button onClick={addMerchant} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Save Merchant
          </button>
        </div>
      )}

      {loading && <p style={{ color: '#aaa' }}>Loading merchants...</p>}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {merchants.map(m => (
          <div key={m.id} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>{m.business_name}</h3>
              <p style={{ margin: '0.25rem 0 0', color: '#aaa', fontSize: '14px' }}>{m.owner_name} · {m.phone} · {m.industry}</p>
            </div>
            <Link href="/deals" style={{ padding: '0.5rem 1rem', background: '#2a2a2a', borderRadius: '6px', textDecoration: 'none', color: '#fff', fontSize: '14px' }}>View Deals</Link>
          </div>
        ))}
        {!loading && merchants.length === 0 && (
          <p style={{ color: '#aaa' }}>No merchants yet. Add your first one!</p>
        )}
      </div>
    </div>
  )
}