'use client'
import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const STAGES = ['All', 'Lead', 'Underwriting', 'Approved', 'Funded', 'Declined']

const stageColors: Record<string, { bg: string, color: string }> = {
  Lead: { bg: '#e0e0e0', color: '#333' },
  Underwriting: { bg: '#fff3cd', color: '#856404' },
  Approved: { bg: '#d4edda', color: '#155724' },
  Funded: { bg: '#cce5ff', color: '#004085' },
  Declined: { bg: '#f8d7da', color: '#721c24' },
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

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newDeal, setNewDeal] = useState({ businessName: '', fundingAmount: '', factorRate: '', funder: '', stage: 'Lead', notes: '' })

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
    setNewDeal({ businessName: '', fundingAmount: '', factorRate: '', funder: '', stage: 'Lead', notes: '' })
    setShowForm(false)
  }

  async function updateStage(id: number, stage: string) {
    await fetch('/api/deals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stage })
    })
    setDeals(deals.map(d => d.id === id ? { ...d, stage } : d))
  }

  const filtered = deals.filter(d => {
    const matchStage = filter === 'All' || d.stage === filter
    const matchSearch = d.business_name?.toLowerCase().includes(search.toLowerCase())
    return matchStage && matchSearch
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* Top Nav */}
      <div style={{ background: '#111', borderBottom: '1px solid #222', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>MCA CRM</span>
          <nav style={{ display: 'flex', gap: '0' }}>
            {['Deals', 'Merchants', 'Funders'].map(item => (
              <Link key={item} href={item === 'Deals' ? '/' : `/${item.toLowerCase()}`} style={{ padding: '0 1rem', height: '52px', display: 'flex', alignItems: 'center', fontSize: '14px', color: item === 'Deals' ? '#fff' : '#888', textDecoration: 'none', borderBottom: item === 'Deals' ? '2px solid #fff' : '2px solid transparent' }}>
                {item}
              </Link>
            ))}
          </nav>
        </div>
        <UserButton />
      </div>

      <div style={{ padding: '1.5rem 2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '22px' }}>Deals</h1>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.6rem 1.25rem', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}>
            + New Deal
          </button>
        </div>

        {/* New Deal Form */}
        {showForm && (
          <div style={{ background: '#1a1a1a', border: '1px solid #333', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>New Deal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <input placeholder="Business Name" value={newDeal.businessName} onChange={e => setNewDeal({...newDeal, businessName: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
              <input placeholder="Funding Amount ($)" value={newDeal.fundingAmount} onChange={e => setNewDeal({...newDeal, fundingAmount: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
              <input placeholder="Factor Rate (e.g. 1.35)" value={newDeal.factorRate} onChange={e => setNewDeal({...newDeal, factorRate: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
              <input placeholder="Funder" value={newDeal.funder} onChange={e => setNewDeal({...newDeal, funder: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
              <select value={newDeal.stage} onChange={e => setNewDeal({...newDeal, stage: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }}>
                {STAGES.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
              </select>
              <input placeholder="Notes" value={newDeal.notes} onChange={e => setNewDeal({...newDeal, notes: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            </div>
            <button onClick={addDeal} style={{ marginTop: '1rem', padding: '0.6rem 1.25rem', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
              Save Deal
            </button>
          </div>
        )}

        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
          <input placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #333', background: '#1a1a1a', color: '#fff', width: '250px' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {STAGES.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid', borderColor: filter === s ? '#fff' : '#333', background: filter === s ? '#fff' : 'transparent', color: filter === s ? '#000' : '#888', cursor: 'pointer', fontSize: '13px' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                {['Company', 'Status', 'Funder', 'Funding Amount', 'Factor Rate', 'Payback', 'Notes'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#888', fontWeight: 500, fontSize: '13px' }}>{h}</th>
                ))}
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#888', fontWeight: 500, fontSize: '13px' }}>Move Stage</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No deals found. Add your first one!</td></tr>
              )}
              {filtered.map((d, i) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #1a1a1a', background: i % 2 === 0 ? '#111' : '#131313' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{d.business_name}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: stageColors[d.stage]?.bg || '#333', color: stageColors[d.stage]?.color || '#fff', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>{d.stage}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#aaa' }}>{d.funder || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>${Number(d.funding_amount).toLocaleString()}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#aaa' }}>{d.factor_rate}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>${Number(d.payback_amount).toLocaleString()}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#888', fontSize: '13px' }}>{d.notes || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <select value={d.stage} onChange={e => updateStage(d.id, e.target.value)} style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a1a', color: '#fff', fontSize: '12px' }}>
                      {STAGES.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ color: '#555', fontSize: '13px', marginTop: '0.75rem' }}>Showing {filtered.length} of {deals.length} deals</p>
      </div>
    </div>
  )
}