'use client'
import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const STAGES = ['All', 'New Application', 'Underwriting', 'Approved', 'Funded', 'Declined']

const stageColors: Record<string, { bg: string, color: string }> = {
  'New Application': { bg: '#e0e0e0', color: '#333' },
  'Underwriting': { bg: '#fff3cd', color: '#856404' },
  'Approved': { bg: '#d4edda', color: '#155724' },
  'Funded': { bg: '#cce5ff', color: '#004085' },
  'Declined': { bg: '#f8d7da', color: '#721c24' },
}

type Merchant = {
  id: number
  business_name: string
  dba: string
  owner_name: string
  phone: string
  email: string
  business_address: string
  home_address: string
  entity_type: string
  industry: string
  business_start_date: string
  federal_tax_id: string
  annual_revenue: string
  ssn: string
  date_of_birth: string
  percent_ownership: string
  stage: string
}

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null)
  const [newMerchant, setNewMerchant] = useState({
    businessName: '', dba: '', ownerName: '', phone: '', email: '',
    businessAddress: '', homeAddress: '', entityType: '', industry: '',
    businessStartDate: '', federalTaxId: '', annualRevenue: '',
    ssn: '', dateOfBirth: '', percentOwnership: ''
  })

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
    setNewMerchant({
      businessName: '', dba: '', ownerName: '', phone: '', email: '',
      businessAddress: '', homeAddress: '', entityType: '', industry: '',
      businessStartDate: '', federalTaxId: '', annualRevenue: '',
      ssn: '', dateOfBirth: '', percentOwnership: ''
    })
    setShowForm(false)
  }

  async function saveEdit() {
    if (!editingMerchant) return
    const res = await fetch('/api/merchants', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingMerchant.id, stage: editingMerchant.stage })
    })
    const saved = await res.json()
    setMerchants(merchants.map(m => m.id === saved.id ? saved : m))
    setEditingMerchant(null)
  }

  const filtered = merchants.filter(m => {
    const matchStage = filter === 'All' || m.stage === filter
    const matchSearch =
      m.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
    return matchStage && matchSearch
  })

  const inputStyle = { padding: '0.4rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff', width: '100%', fontSize: '13px' }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif' }}>

      {/* Top Nav */}
      <div style={{ background: '#111', borderBottom: '1px solid #222', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>MCA CRM</span>
          <nav style={{ display: 'flex' }}>
            {['Deals', 'Merchants', 'Funders'].map(item => (
              <Link key={item} href={item === 'Deals' ? '/' : `/${item.toLowerCase()}`} style={{ padding: '0 1rem', height: '52px', display: 'flex', alignItems: 'center', fontSize: '14px', color: item === 'Merchants' ? '#fff' : '#888', textDecoration: 'none', borderBottom: item === 'Merchants' ? '2px solid #fff' : '2px solid transparent' }}>
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
          <h1 style={{ margin: 0, fontSize: '22px' }}>Merchants</h1>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.6rem 1.25rem', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}>
            + New Merchant
          </button>
        </div>

        {/* New Merchant Form */}
        {showForm && (
          <div style={{ background: '#1a1a1a', border: '1px solid #333', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>New Merchant</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              {[
                ['Business Name*', 'businessName'], ['DBA', 'dba'], ['Owner Name', 'ownerName'],
                ['Phone', 'phone'], ['Email', 'email'], ['Business Address', 'businessAddress'],
                ['Home Address', 'homeAddress'], ['Entity Type', 'entityType'], ['Industry', 'industry'],
                ['Business Start Date', 'businessStartDate'], ['Federal Tax ID', 'federalTaxId'],
                ['Annual Revenue', 'annualRevenue'], ['SSN', 'ssn'], ['Date of Birth', 'dateOfBirth'],
                ['% Ownership', 'percentOwnership']
              ].map(([label, key]) => (
                <div key={key}>
                  <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>{label}</label>
                  <input
                    value={(newMerchant as any)[key]}
                    onChange={e => setNewMerchant({...newMerchant, [key]: e.target.value})}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff', width: '100%' }}
                  />
                </div>
              ))}
            </div>
            <button onClick={addMerchant} style={{ marginTop: '1rem', padding: '0.6rem 1.25rem', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
              Save Merchant
            </button>
          </div>
        )}

        {/* Edit Modal */}
        {editingMerchant && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '2rem', width: '600px', maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto' }}>
              <h3 style={{ marginTop: 0 }}>{editingMerchant.business_name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>Legal Business Name</label><input value={editingMerchant.business_name} onChange={e => setEditingMerchant({...editingMerchant, business_name: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>DBA</label><input value={editingMerchant.dba || ''} onChange={e => setEditingMerchant({...editingMerchant, dba: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>Owner Name</label><input value={editingMerchant.owner_name || ''} onChange={e => setEditingMerchant({...editingMerchant, owner_name: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>Phone</label><input value={editingMerchant.phone || ''} onChange={e => setEditingMerchant({...editingMerchant, phone: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>Email</label><input value={editingMerchant.email || ''} onChange={e => setEditingMerchant({...editingMerchant, email: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>Annual Revenue</label><input value={editingMerchant.annual_revenue || ''} onChange={e => setEditingMerchant({...editingMerchant, annual_revenue: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>Entity Type</label><input value={editingMerchant.entity_type || ''} onChange={e => setEditingMerchant({...editingMerchant, entity_type: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>Industry</label><input value={editingMerchant.industry || ''} onChange={e => setEditingMerchant({...editingMerchant, industry: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>Business Start Date</label><input value={editingMerchant.business_start_date || ''} onChange={e => setEditingMerchant({...editingMerchant, business_start_date: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>Federal Tax ID</label><input value={editingMerchant.federal_tax_id || ''} onChange={e => setEditingMerchant({...editingMerchant, federal_tax_id: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>SSN</label><input value={editingMerchant.ssn || ''} onChange={e => setEditingMerchant({...editingMerchant, ssn: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>Date of Birth</label><input value={editingMerchant.date_of_birth || ''} onChange={e => setEditingMerchant({...editingMerchant, date_of_birth: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>% Ownership</label><input value={editingMerchant.percent_ownership || ''} onChange={e => setEditingMerchant({...editingMerchant, percent_ownership: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>Business Address</label><input value={editingMerchant.business_address || ''} onChange={e => setEditingMerchant({...editingMerchant, business_address: e.target.value})} style={inputStyle} /></div>
                <div><label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '3px' }}>Stage</label>
                  <select value={editingMerchant.stage} onChange={e => setEditingMerchant({...editingMerchant, stage: e.target.value})} style={inputStyle}>
                    {STAGES.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button onClick={saveEdit} style={{ padding: '0.6rem 1.25rem', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Save Changes</button>
                <button onClick={() => setEditingMerchant(null)} style={{ padding: '0.6rem 1.25rem', background: 'transparent', color: '#aaa', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input placeholder="Search merchants..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #333', background: '#1a1a1a', color: '#fff', width: '250px' }} />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {STAGES.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid', borderColor: filter === s ? '#fff' : '#333', background: filter === s ? '#fff' : 'transparent', color: filter === s ? '#000' : '#888', cursor: 'pointer', fontSize: '13px' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '1100px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                {['Company', 'DBA', 'Status', 'Owner', 'Phone', 'Email', 'Industry', 'Entity', 'Annual Revenue', 'Start Date', ''].map((h, i) => (
                  <th key={i} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#888', fontWeight: 500, fontSize: '12px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={11} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading...</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={11} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No merchants yet. Add your first one or wait for a Jotform submission!</td></tr>}
              {filtered.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #1a1a1a', background: i % 2 === 0 ? '#111' : '#131313' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{m.business_name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#aaa' }}>{m.dba || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: stageColors[m.stage]?.bg || '#333', color: stageColors[m.stage]?.color || '#fff', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap' }}>{m.stage || 'New Application'}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', color: '#aaa' }}>{m.owner_name}</td>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', color: '#aaa' }}>{m.phone}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#aaa' }}>{m.email}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#aaa', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.industry}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#aaa', whiteSpace: 'nowrap' }}>{m.entity_type}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#aaa', whiteSpace: 'nowrap' }}>{m.annual_revenue}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#aaa', whiteSpace: 'nowrap' }}>{m.business_start_date}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button onClick={() => setEditingMerchant(m)} style={{ padding: '0.3rem 0.75rem', border: '1px solid #333', borderRadius: '4px', background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: '#555', fontSize: '13px', marginTop: '0.75rem' }}>Showing {filtered.length} of {merchants.length} merchants</p>
      </div>
    </div>
  )
}