'use client'
import { useState } from 'react'
import Link from 'next/link'

const PAPER_TIERS = ['A Paper', 'B Paper', 'C Paper', 'D Paper']
const tierColors: Record<string, string> = {
  'A Paper': '#d4edda',
  'B Paper': '#cce5ff',
  'C Paper': '#fff3cd',
  'D Paper': '#f8d7da',
}
const tierText: Record<string, string> = {
  'A Paper': '#155724',
  'B Paper': '#004085',
  'C Paper': '#856404',
  'D Paper': '#721c24',
}

type Funder = {
  id: number
  name: string
  minAmount: string
  maxAmount: string
  minScore: string
  industries: string
  notes: string
  paper: string
}

export default function FundersPage() {
  const [funders, setFunders] = useState<Funder[]>([
    { id: 1, name: 'Libertas', minAmount: '10000', maxAmount: '500000', minScore: '500', industries: 'All', notes: 'Fast funding, 24hr approval', paper: 'B Paper' },
    { id: 2, name: 'Bluevine', minAmount: '5000', maxAmount: '250000', minScore: '625', industries: 'All except restaurants', notes: 'Good rates for established businesses', paper: 'A Paper' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newFunder, setNewFunder] = useState({ name: '', minAmount: '', maxAmount: '', minScore: '', industries: '', notes: '', paper: 'A Paper' })

  function addFunder() {
    if (!newFunder.name) return
    setFunders([...funders, { ...newFunder, id: funders.length + 1 }])
    setNewFunder({ name: '', minAmount: '', maxAmount: '', minScore: '', industries: '', notes: '', paper: 'A Paper' })
    setShowForm(false)
  }

  function saveEdit(id: number, updated: Funder) {
    setFunders(funders.map(f => f.id === id ? updated : f))
    setEditingId(null)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#ffffff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Back to Dashboard</Link>
          <h1 style={{ margin: '0.5rem 0 0' }}>Funders</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.75rem 1.5rem', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          + Add Funder
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>New Funder</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input placeholder="Funder Name" value={newFunder.name} onChange={e => setNewFunder({...newFunder, name: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <input placeholder="Min Funding Amount ($)" value={newFunder.minAmount} onChange={e => setNewFunder({...newFunder, minAmount: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <input placeholder="Max Funding Amount ($)" value={newFunder.maxAmount} onChange={e => setNewFunder({...newFunder, maxAmount: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <input placeholder="Minimum Credit Score" value={newFunder.minScore} onChange={e => setNewFunder({...newFunder, minScore: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <input placeholder="Accepted Industries" value={newFunder.industries} onChange={e => setNewFunder({...newFunder, industries: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <input placeholder="Notes" value={newFunder.notes} onChange={e => setNewFunder({...newFunder, notes: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
            <select value={newFunder.paper} onChange={e => setNewFunder({...newFunder, paper: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }}>
              {PAPER_TIERS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={addFunder} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Save Funder
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {funders.map(f => (
          <div key={f.id} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '1.25rem', color: '#fff' }}>
            {editingId === f.id ? (
              <EditForm funder={f} onSave={updated => saveEdit(f.id, updated)} onCancel={() => setEditingId(null)} />
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>{f.name}</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ background: tierColors[f.paper], color: tierText[f.paper], padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>{f.paper}</span>
                    <button onClick={() => setEditingId(f.id)} style={{ padding: '0.35rem 0.75rem', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer', background: '#2a2a2a', color: '#fff', fontSize: '13px' }}>Edit</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.75rem', fontSize: '14px', color: '#aaa' }}>
                  <span>Min: ${Number(f.minAmount).toLocaleString()}</span>
                  <span>Max: ${Number(f.maxAmount).toLocaleString()}</span>
                  <span>Min Score: {f.minScore}</span>
                  <span>Industries: {f.industries}</span>
                </div>
                {f.notes && <p style={{ margin: '0.75rem 0 0', fontSize: '13px', color: '#888', borderTop: '1px solid #333', paddingTop: '0.75rem' }}>{f.notes}</p>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function EditForm({ funder, onSave, onCancel }: { funder: Funder, onSave: (f: Funder) => void, onCancel: () => void }) {
  const [form, setForm] = useState(funder)
  const PAPER_TIERS = ['A Paper', 'B Paper', 'C Paper', 'D Paper']

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
      <input placeholder="Min Amount" value={form.minAmount} onChange={e => setForm({...form, minAmount: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
      <input placeholder="Max Amount" value={form.maxAmount} onChange={e => setForm({...form, maxAmount: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
      <input placeholder="Min Credit Score" value={form.minScore} onChange={e => setForm({...form, minScore: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
      <input placeholder="Industries" value={form.industries} onChange={e => setForm({...form, industries: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
      <input placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }} />
      <select value={form.paper} onChange={e => setForm({...form, paper: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }}>
        {PAPER_TIERS.map(t => <option key={t}>{t}</option>)}
      </select>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => onSave(form)} style={{ padding: '0.5rem 1rem', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
        <button onClick={onCancel} style={{ padding: '0.5rem 1rem', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  )
}