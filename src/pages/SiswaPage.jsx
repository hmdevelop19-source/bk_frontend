import { useState, useMemo } from 'react'
import {
  RiUserAddLine, RiSearchLine, RiFilterLine, RiDownloadLine,
  RiEditLine, RiEyeLine, RiDeleteBinLine, RiCloseLine,
  RiSaveLine, RiUserLine, RiAlertLine, RiCheckLine,
  RiUploadLine, RiTimeLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'
import { useSettings } from '../contexts/SettingsContext'
import { useData } from '../contexts/DataContext'
import api from '../lib/axios'

const STATUS_CLS = {
  'Aktif': 'badge bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'Perhatian': 'badge bg-amber-500/20 text-amber-300 border border-amber-500/30',
  'Alumni': 'badge bg-dark-500/30 text-dark-300 border border-dark-500/30',
}

const PAGE_SIZE = 5

function SiswaModal({ isOpen, onClose, initial, onSave, classes }) {
  const emptyForm = { nama:'', nis:'', kelas: classes?.[0] || '', jk:'L', status:'Aktif', hp:'', alamat:'' }
  const [form, setForm] = useState(initial || emptyForm)
  const isEdit = !!initial?.id

  if (!isOpen) return null
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nama.trim() || !form.nis.trim()) return toast.error('Nama dan NIS wajib diisi!')
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-xl card-feature flex flex-col max-h-[90vh] p-0" style={{animationDuration:'0.25s'}}>
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
              <RiUserLine className="text-2xl text-primary-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">{isEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h2>
              <p className="text-dark-200 text-xs mt-0.5">{isEdit ? `NIS: ${initial.nis}` : 'Isi formulir data siswa binaan'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-dark-200 hover:text-white transition-colors"><RiCloseLine className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-2">Nama Lengkap *</label>
              <input className="input-field" placeholder="Contoh: Ahmad Fauzi" value={form.nama} onChange={e=>set('nama',e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-2">NIS *</label>
              <input className="input-field" placeholder="2024001" value={form.nis} onChange={e=>set('nis',e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-2">Jenis Kelamin</label>
              <select className="input-field" value={form.jk} onChange={e=>set('jk',e.target.value)}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-2">Kelas</label>
              <select className="input-field" value={form.kelas} onChange={e=>set('kelas',e.target.value)}>
                {classes?.map(k=><option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-2">Status</label>
              <select className="input-field" value={form.status} onChange={e=>set('status',e.target.value)}>
                <option value="Aktif">Aktif</option>
                <option value="Perhatian">Perlu Perhatian</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-2">No. HP / WA</label>
              <input className="input-field" placeholder="+62 8xx-xxxx-xxxx" value={form.hp} onChange={e=>set('hp',e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-2">Alamat Rumah</label>
              <textarea className="input-field resize-none" rows={2} placeholder="Jl. Contoh No. 1, Kota" value={form.alamat} onChange={e=>set('alamat',e.target.value)} />
            </div>
          </div>
        </form>
        <div className="p-5 border-t border-white/10 bg-dark-900/50 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 btn-secondary py-2.5 text-sm">Batal</button>
          <button type="button" onClick={handleSubmit} className="flex-1 btn-primary py-2.5 text-sm gap-2">
            <RiSaveLine /> {isEdit ? 'Simpan Perubahan' : 'Tambah Siswa'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailModal({ siswa, onClose }) {
  if (!siswa) return null
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md card-feature flex flex-col max-h-[90vh] p-0 animate-in" style={{animationDuration:'0.25s'}}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="font-display font-bold text-white text-lg">Detail Siswa</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-dark-200 hover:text-white"><RiCloseLine /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center text-2xl font-bold text-white">{siswa.nama[0]}</div>
            <div>
              <div className="font-bold text-white text-xl">{siswa.nama}</div>
              <div className="text-dark-200 text-sm font-mono">{siswa.nis}</div>
              <span className={STATUS_CLS[siswa.status]}>{siswa.status}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: 'Kelas', v: siswa.kelas },
              { l: 'Jenis Kelamin', v: siswa.jk === 'L' ? '👦 Laki-laki' : '👧 Perempuan' },
              { l: 'No. HP', v: siswa.hp || '-' },
              { l: 'Total Konseling', v: `${siswa.konseling} sesi` },
            ].map(({ l, v }) => (
              <div key={l} className="p-3 rounded-xl glass">
                <div className="text-dark-300 text-xs uppercase font-bold tracking-wider mb-1">{l}</div>
                <div className="text-white font-semibold text-sm">{v}</div>
              </div>
            ))}
          </div>
          {siswa.alamat && (
            <div className="p-3 rounded-xl glass">
              <div className="text-dark-300 text-xs uppercase font-bold tracking-wider mb-1">Alamat</div>
              <div className="text-white text-sm">{siswa.alamat}</div>
            </div>
          )}
          
          {/* Timeline Histori Konseling & Kasus (Mock) */}
          <div className="mt-4 border-t border-white/20 pt-4">
            <h3 className="text-white font-bold text-sm mb-3">Timeline Histori</h3>
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
              <div className="flex gap-3 relative before:absolute before:left-[11px] before:top-6 before:bottom-0 before:w-0.5 before:bg-white/10">
                <div className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center flex-shrink-0 z-10 border border-primary-500/30">
                  <RiTimeLine className="text-xs" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">Konseling Individu</div>
                  <div className="text-dark-300 text-xs">Topik: Motivasi Belajar · 12 Mei 2026</div>
                </div>
              </div>
              <div className="flex gap-3 relative before:absolute before:left-[11px] before:top-6 before:bottom-0 before:w-0.5 before:bg-white/10">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 z-10 border border-amber-500/30">
                  <RiAlertLine className="text-xs" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">Teguran Kedisiplinan</div>
                  <div className="text-dark-300 text-xs">Terlambat masuk kelas · 05 Mei 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-white/20">
          <button onClick={onClose} className="w-full btn-secondary py-2.5 text-sm">Tutup</button>
        </div>
      </div>
    </div>
  )
}

function ConfirmDelete({ siswa, onClose, onConfirm }) {
  if (!siswa) return null
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-950 border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in" style={{animationDuration:'0.2s'}}>
        <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
          <RiAlertLine className="text-3xl text-red-400" />
        </div>
        <h3 className="text-white font-bold text-lg text-center mb-2">Hapus Data Siswa?</h3>
        <p className="text-dark-200 text-sm text-center mb-6">Data <span className="text-white font-semibold">{siswa.nama}</span> akan dihapus permanen dan tidak bisa dikembalikan.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary py-2.5 text-sm">Batal</button>
          <button onClick={() => { onConfirm(siswa.id); onClose() }} className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-all">Hapus</button>
        </div>
      </div>
    </div>
  )
}

export default function SiswaPage() {
  const { classes } = useSettings()
  const { siswa, refreshData } = useData()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('Semua')
  const [filterKelas, setFilterKelas] = useState('Semua')
  const [showFilter, setShowFilter] = useState(false)
  const [page, setPage] = useState(1)
  const [modalAdd, setModalAdd] = useState(false)
  const [modalEdit, setModalEdit] = useState(null)
  const [modalDetail, setModalDetail] = useState(null)
  const [modalDelete, setModalDelete] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])

  const toggleSelectAll = () => {
    if (selectedIds.length === paginated.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginated.map(s => s.id))
    }
  }

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id))
    } else {
      setSelectedIds(prev => [...prev, id])
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Yakin ingin menghapus ${selectedIds.length} siswa terpilih?`)) {
      setSiswa(prev => prev.filter(s => !selectedIds.includes(s.id)))
      setSelectedIds([])
      toast.success('Data terpilih berhasil dihapus.')
    }
  }

  const filtered = useMemo(() => {
    return siswa.filter(s => {
      const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search)
      const matchStatus = filterStatus === 'Semua' || s.status === filterStatus
      const matchKelas = filterKelas === 'Semua' || s.kelas === filterKelas
      return matchSearch && matchStatus && matchKelas
    })
  }, [siswa, search, filterStatus, filterKelas])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleAdd = async (form) => {
    try {
      await api.post('/students', form)
      refreshData()
      setModalAdd(false)
      toast.success(`Siswa ${form.nama} berhasil ditambahkan!`)
    } catch (err) {
      toast.error('Gagal menambahkan siswa.')
    }
  }

  const handleEdit = async (form) => {
    try {
      await api.put(`/students/${modalEdit.id}`, form)
      refreshData()
      setModalEdit(null)
      toast.success('Data siswa berhasil diperbarui!')
    } catch (err) {
      toast.error('Gagal memperbarui data siswa.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/students/${id}`)
      refreshData()
      toast.success('Data siswa berhasil dihapus.')
    } catch (err) {
      toast.error('Gagal menghapus data siswa.')
    }
  }

  const handleExport = () => {
    const rows = [['NIS','Nama','Kelas','J/K','Status','Konseling']]
    filtered.forEach(s => rows.push([s.nis, s.nama, s.kelas, s.jk, s.status, s.konseling]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'data-siswa.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Data berhasil diekspor ke CSV!')
  }

  const resetFilter = () => { setFilterStatus('Semua'); setFilterKelas('Semua'); setShowFilter(false) }
  const activeFilterCount = [filterStatus !== 'Semua', filterKelas !== 'Semua'].filter(Boolean).length

  return (
    <div className="space-y-6">
      <SiswaModal isOpen={modalAdd} onClose={() => setModalAdd(false)} onSave={handleAdd} classes={classes} />
      <SiswaModal isOpen={!!modalEdit} onClose={() => setModalEdit(null)} initial={modalEdit} onSave={handleEdit} classes={classes} />
      <DetailModal siswa={modalDetail} onClose={() => setModalDetail(null)} />
      <ConfirmDelete siswa={modalDelete} onClose={() => setModalDelete(null)} onConfirm={handleDelete} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Data Siswa</h1>
          <p className="text-dark-200 text-sm">Kelola data siswa binaan Guru BK</p>
        </div>
        <div className="flex gap-2">
          <label className="btn-secondary text-sm py-2 cursor-pointer">
            <RiUploadLine /> Import CSV
            <input 
              type="file" 
              className="hidden" 
              accept=".csv" 
              onChange={(e) => {
                const file = e.target.files[0]
                if (!file) return
                
                const reader = new FileReader()
                reader.onload = (evt) => {
                  try {
                    const text = evt.target.result
                    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
                    if (lines.length <= 1) {
                      return toast.error('Format file CSV tidak valid atau kosong!')
                    }

                    // Skip headers
                    const headers = lines[0].split(',').map(h => h.toLowerCase().trim())
                    const newStudents = []
                    let baseId = Math.max(0, ...siswa.map(s => s.id)) + 1

                    for (let i = 1; i < lines.length; i++) {
                      const cols = lines[i].split(',').map(c => c.trim())
                      if (cols.length < 2) continue // skip incomplete lines

                      // Map standard CSV columns: NIS, Nama, Kelas, JK, Status, Konseling (some can be optional)
                      // Assumes layout: NIS,Nama,Kelas,J/K,Status,Konseling
                      newStudents.push({
                        id: baseId++,
                        nis: cols[0] || `IMPORT${Date.now()}${i}`,
                        nama: cols[1] || 'Tanpa Nama',
                        kelas: cols[2] || classes[0] || 'Umum',
                        jk: cols[3] ? (cols[3].toUpperCase().includes('P') ? 'P' : 'L') : 'L',
                        status: cols[4] || 'Aktif',
                        konseling: parseInt(cols[5]) || 0,
                        hp: '',
                        alamat: ''
                      })
                    }

                    if (newStudents.length > 0) {
                      setSiswa(prev => [...newStudents, ...prev])
                      toast.success(`${newStudents.length} data siswa berhasil diimport!`)
                    }
                  } catch (err) {
                    toast.error('Gagal membaca file CSV.')
                    console.error(err)
                  }
                }
                reader.readAsText(file)
                e.target.value = null
              }} 
            />
          </label>
          <button onClick={handleExport} className="btn-secondary text-sm py-2 hidden sm:flex"><RiDownloadLine /> Export</button>
          <button id="siswa-add-btn" onClick={() => setModalAdd(true)} className="btn-primary text-sm py-2"><RiUserAddLine /> Tambah Siswa</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Siswa', value: siswa.length, color: 'text-primary-400' },
          { label: 'Aktif', value: siswa.filter(s=>s.status==='Aktif').length, color: 'text-teal-400' },
          { label: 'Perlu Perhatian', value: siswa.filter(s=>s.status==='Perhatian').length, color: 'text-amber-400' },
          { label: 'Konseling Aktif', value: siswa.reduce((a,s)=>a+s.konseling,0), color: 'text-accent-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card-feature text-center py-5">
            <div className={`font-display font-black text-3xl ${color} mb-1 drop-shadow-md`}>{value}</div>
            <div className="text-dark-200 text-xs uppercase tracking-wider font-bold">{label}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="card-feature">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 relative">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-200" />
            <input
              type="text" placeholder="Cari nama atau NIS..."
              className="input-field pl-9"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <button
            onClick={() => setShowFilter(f => !f)}
            className={`btn-secondary text-sm py-2.5 gap-2 relative ${activeFilterCount > 0 ? 'border-primary-500/60 text-primary-300' : ''}`}
          >
            <RiFilterLine /> Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="mb-5 p-4 rounded-xl glass border border-primary-500/20 space-y-3 animate-in" style={{animationDuration:'0.2s'}}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">Panel Filter</span>
              <button onClick={resetFilter} className="text-xs text-dark-200 hover:text-red-400 transition-colors flex items-center gap-1"><RiCloseLine /> Reset</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-dark-200 block mb-2">Status</label>
                <select className="input-field text-sm" value={filterStatus} onChange={e=>{setFilterStatus(e.target.value);setPage(1)}}>
                  {['Semua','Aktif','Perhatian','Alumni'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-dark-200 block mb-2">Kelas</label>
                <select className="input-field text-sm" value={filterKelas} onChange={e=>{setFilterKelas(e.target.value);setPage(1)}}>
                  <option>Semua</option>
                  {classes.map(k=><option key={k}>{k}</option>)}
                </select>
              </div>
            </div>
            <button onClick={()=>setShowFilter(false)} className="btn-primary text-xs py-2 w-full gap-2"><RiCheckLine /> Terapkan Filter</button>
          </div>
        )}

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3 mb-4 flex items-center justify-between animate-in">
            <span className="text-sm font-semibold text-primary-300">{selectedIds.length} data terpilih</span>
            <div className="flex gap-2">
              <button className="btn-secondary text-xs py-1.5" onClick={() => setSelectedIds([])}>Batal</button>
              <button className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-xs font-medium flex items-center gap-2 shadow-none" onClick={handleBulkDelete}>
                <RiDeleteBinLine /> Hapus Terpilih
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="table-header text-left pb-3 pl-3 w-10">
                  <input type="checkbox" className="accent-primary-500 cursor-pointer w-4 h-4 rounded" 
                    checked={paginated.length > 0 && selectedIds.length === paginated.length} 
                    onChange={toggleSelectAll} 
                  />
                </th>
                <th className="table-header text-left pb-3">Nama Siswa</th>
                <th className="table-header text-left pb-3">NIS</th>
                <th className="table-header text-left pb-3">Kelas</th>
                <th className="table-header text-left pb-3 hidden sm:table-cell">J/K</th>
                <th className="table-header text-left pb-3">Status</th>
                <th className="table-header text-left pb-3 hidden md:table-cell">Konseling</th>
                <th className="table-header text-center pb-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-dark-300">Tidak ada data siswa yang cocok.</td></tr>
              ) : paginated.map(s => (
                <tr key={s.id} className={`hover:bg-white/5 transition-colors cursor-pointer group ${selectedIds.includes(s.id) ? 'bg-primary-500/5' : ''}`}>
                  <td className="table-cell pl-3">
                    <input type="checkbox" className="accent-primary-500 cursor-pointer w-4 h-4 rounded"
                      checked={selectedIds.includes(s.id)}
                      onChange={() => toggleSelect(s.id)}
                    />
                  </td>
                  <td className="table-cell font-medium text-white">{s.nama}</td>
                  <td className="table-cell font-mono text-xs">{s.nis}</td>
                  <td className="table-cell">{s.kelas}</td>
                  <td className="table-cell hidden sm:table-cell">{s.jk === 'L' ? '👦 L' : '👧 P'}</td>
                  <td className="table-cell"><span className={STATUS_CLS[s.status]}>{s.status}</span></td>
                  <td className="table-cell hidden md:table-cell">
                    <span className="font-semibold text-white">{s.konseling}</span>
                    <span className="text-dark-300 ml-1">sesi</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <button title="Detail" onClick={() => setModalDetail(s)} className="p-1.5 rounded-lg hover:bg-primary-500/20 text-dark-200 hover:text-primary-300 transition-colors"><RiEyeLine /></button>
                      <button title="Edit" onClick={() => setModalEdit(s)} className="p-1.5 rounded-lg hover:bg-teal-500/20 text-dark-200 hover:text-teal-300 transition-colors"><RiEditLine /></button>
                      <button title="Hapus" onClick={() => setModalDelete(s)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-dark-200 hover:text-red-400 transition-colors"><RiDeleteBinLine /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-dark-200 text-sm border-t border-white/20 pt-4">
          <span>Menampilkan {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} dari {filtered.length} siswa</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="w-8 h-8 rounded-lg text-sm transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed">‹</button>
            {Array.from({length: totalPages}, (_, i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm transition-colors ${p===page ? 'bg-primary-600 text-white' : 'hover:bg-white/10'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="w-8 h-8 rounded-lg text-sm transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed">›</button>
          </div>
        </div>
      </div>
    </div>
  )
}
