'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const STAGES = ['Lead', 'Underwriting', 'Approved', 'Funded', 'Declined']

const stageColors: Record<string, string> = {
  Lead: '#e0e0e0',
  Underwriting: '#fff3cd',
  Approved: '#d4edda',
  Funded: '#cce5ff',
  Declined: '#f8d7da',
}

const stageText: Record<string, string> = {
  Lead: '#000',
  Underwriting: '#856404',
  Approved: '#155724',
  Funded: '#004085',
  Declined: '#721c24',
}

type Deal = {
  id: number
  business_name: string
  funding_amount: string
  factor_rate: string
  payback_amount: string
  funder: string
  stage: string
  notes: string
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newDeal, setNewDeal] = useState({ merchantId: '', businessName: '', fundingAmount: '', factorRate: '', funder: '', stage: 'Lead', notes: '' })

  useEffect(() => {
    fetch('/api/deals')
      .then(res => res.json())
      .then(data => { setDeals(data); setLoading(false) })
  }, [])

  async function addDeal() {
    if (!newDeal.businessName) return
    const res = await fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDeal)
    })
    const saved = await res.json()
    setDeals([saved, ...deals])
    setNewDeal({ merchantId: '', businessName: '', fundingAmount: '', factorRate: '', funder: '', stage: 'Lead', notes: '' })
    setShowForm(false)
  }

  async function moveStage(id: number, direction: number) {
    const deal = deals.find(d => d.id === id)
    if (!deal) return
    const currentIndex = STAGES.indexOf(deal.stage)
    const newStage = STAGES[Math.max(0, Math.min(STAGES.length - 1, currentIndex + direction))]
    await fetch('/api/deals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stage: newStage })
    })
    setDeals(deals.map(d => d.id === id ? { ...d, stage: newStage } : d))
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#ffffff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Back to Dashboard</Link>
          <h1 style={{ margin: '0.5rem 0 0' }}>Deals</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.75rem 1.5rem', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          + Add Deal
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>New Deal</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input placeholder="Business Name" value={newDeal.businessName} onChange={e => setNewDeal({...newDeal, businessName: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <input placeholder="Funding Amount ($)" value={newDeal.fundingAmount} onChange={e => setNewDeal({...newDeal, fundingAmount: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <input placeholder="Factor Rate (e.g. 1.35)" value={newDeal.factorRate} onChange={e => setNewDeal({...newDeal, factorRate: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <input placeholder="Funder" value={newDeal.funder} onChange={e => setNewDeal({...newDeal, funder: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <select value={newDeal.stage} onChange={e => setNewDeal({...newDeal, stage: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }}>
              {STAGES.map(s => <option key={s}>{s}</option>)}
            </select>
            <input placeholder="Notes" value={newDeal.notes} onChange={e => setNewDeal({...newDeal, notes: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
          </div>
          <button onClick={addDeal} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Save Deal
          </button>
        </div>
      )}

      {loading && <p style={{ color: '#aaa' }}>Loading deals...</p>}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {deals.map(d => (
          <div key={d.id} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '1.25rem', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0 }}>{d.business_name}</h3>
                <p style={{ margin: '0.25rem 0 0', color: '#aaa', fontSize: '14px' }}>
                  ${Number(d.funding_amount).toLocaleString()} · Factor {d.factor_rate} · Payback ${Number(d.payback_amount).toLocaleString()} · {d.funder}
                </p>
                {d.notes && <p style={{ margin: '0.25rem 0 0', color: '#888', fontSize: '13px' }}>{d.notes}</p>}
              </div>
              <span style={{ background: stageColors[d.stage], color: stageText[d.stage], padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>{d.stage}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button onClick={() => moveStage(d.id, -1)} style={{ padding: '0.4rem 0.75rem', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer', background: '#2a2a2a', color: '#fff' }}>← Back</button>
              <button onClick={() => moveStage(d.id, 1)} style={{ padding: '0.4rem 0.75rem', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer', background: '#2a2a2a', color: '#fff' }}>Forward →</button>
            </div>
          </div>
        ))}
        {!loading && deals.length === 0 && (
          <p style={{ color: '#aaa' }}>No deals yet. Add your first one!</p>
        )}
      </div>
    </div>
  )
}