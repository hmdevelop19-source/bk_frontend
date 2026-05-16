import { useState, useRef } from 'react'
import {
  RiAddLine, RiHeartLine, RiUserLine, RiTimeLine, RiCheckboxCircleLine,
  RiFileLine, RiCloseLine, RiBallPenLine, RiEraserLine, RiCheckLine,
  RiArrowRightLine, RiFileTextLine, RiAccountCircleLine, RiPrinterLine
} from 'react-icons/ri'
import SignatureCanvas from 'react-signature-canvas'
import toast from 'react-hot-toast'
import { useSettings } from '../contexts/SettingsContext'
import { useData } from '../contexts/DataContext'
import api from '../lib/axios'

const STATUS_CLS = {
  'Selesai': 'badge bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'Proses': 'badge bg-primary-500/20 text-primary-300 border border-primary-500/30',
  'Terjadwal': 'badge bg-amber-500/20 text-amber-300 border border-amber-500/30',
}

const JENIS_CLS = {
  'Individu': 'badge bg-accent-500/20 text-accent-300 border border-accent-500/30',
  'Kelompok': 'badge bg-teal-500/20 text-teal-300 border border-teal-500/30',
}

export default function KonselingPage() {
  const [activeTab, setActiveTab] = useState('semua')
  const [showForm, setShowForm] = useState(false)
  const { sessions, siswa, refreshData } = useData()
  const tabs = ['semua', 'terjadwal', 'proses', 'selesai']
  
  // Signature ref
  const sigCanvas = useRef(null)

  // Form state
  const { classes } = useSettings()
  const [formData, setFormData] = useState({
    siswa: '', kelas: classes?.[0] || '', topik: '', jenis: 'Individu', ringkasan: ''
  })
  const [skipSignature, setSkipSignature] = useState(false)

  const handleClearSignature = () => {
    if (sigCanvas.current) sigCanvas.current.clear()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!skipSignature && sigCanvas.current.isEmpty()) {
      return toast.error("Harap masukkan tanda tangan siswa sebagai validasi jurnal atau centang 'Lewati Tanda Tangan'.");
    }

    // Find student ID if possible, otherwise use a placeholder or create one
    // For now, let's just use the first student as a fallback or assume the user selects one
    const student = siswa.find(s => s.nama === formData.siswa)
    if (!student) return toast.error("Siswa tidak ditemukan. Harap pilih dari daftar.");

    try {
      await api.post('/sessions', {
        student_id: student.id,
        tanggal: new Date().toISOString().split('T')[0],
        topik: formData.topik,
        jenis: formData.jenis,
        status: 'Selesai',
        durasi: '30 mnt',
        signature: !skipSignature
      })
      
      refreshData()
      setShowForm(false)
      setFormData({ siswa: '', kelas: classes?.[0] || '', topik: '', jenis: 'Individu', ringkasan: '' })
      toast.success("Jurnal Konseling Berhasil Disimpan! Digital signature terekam.");
    } catch (err) {
      toast.error("Gagal menyimpan jurnal konseling.");
    }
  }

  const filtered = activeTab === 'semua'
    ? sessions
    : sessions.filter(s => s.status.toLowerCase() === activeTab)

  return (
    <div className="space-y-6 relative">
      {/* OVERLAY FORM DRAWER */}
      {showForm && (
        <div className="fixed inset-0 z-[999] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-xl h-full card-feature border-r-0 border-t-0 border-b-0 rounded-none rounded-l-2xl shadow-2xl overflow-y-auto animate-in flex flex-col p-0" style={{animationDuration: '0.3s'}}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-dark-900/50 backdrop-blur z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                  <RiBallPenLine className="text-xl text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-white text-lg">Pencatatan Jurnal Digital</h2>
                  <p className="text-dark-200 text-xs">Rekam sesi layanan bimbingan konseling</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-white/10 text-dark-200 hover:text-white transition-colors">
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-dark-200 block mb-2">Informasi Subjek</label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" placeholder="Nama Siswa / Kelompok" required 
                    className="input-field text-sm col-span-2"
                    value={formData.siswa} onChange={e => setFormData({...formData, siswa: e.target.value})}
                  />
                  <select 
                    className="input-field text-sm"
                    value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value})}
                  >
                    <option value="" disabled>Pilih Kelas</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select 
                    className="input-field text-sm"
                    value={formData.jenis} onChange={e => setFormData({...formData, jenis: e.target.value})}
                  >
                    <option value="Individu">Individu</option>
                    <option value="Kelompok">Kelompok</option>
                    <option value="Klasikal">Klasikal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-dark-200 block mb-2">Detail Layanan</label>
                <input 
                  type="text" placeholder="Topik Permasalahan" required 
                  className="input-field text-sm mb-3"
                  value={formData.topik} onChange={e => setFormData({...formData, topik: e.target.value})}
                />
                <textarea 
                  placeholder="Tulis ringkasan solusi/kesimpulan sesi konseling di sini..." 
                  className="input-field text-sm min-h-[120px] resize-none"
                  value={formData.ringkasan} onChange={e => setFormData({...formData, ringkasan: e.target.value})}
                ></textarea>
              </div>

              {/* SIGNATURE AREA */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <RiAccountCircleLine className="text-base" /> Tanda Tangan Siswa (Validasi)
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1 text-xs text-white cursor-pointer select-none">
                      <input type="checkbox" className="accent-primary-500 cursor-pointer w-3.5 h-3.5 rounded" checked={skipSignature} onChange={e => setSkipSignature(e.target.checked)} />
                      Lewati
                    </label>
                    <button type="button" onClick={handleClearSignature} className="text-xs text-dark-200 hover:text-red-400 flex items-center gap-1 transition-colors">
                      <RiEraserLine /> Bersihkan
                    </button>
                  </div>
                </div>
                {!skipSignature ? (
                  <div className="relative border border-white/10 rounded-xl bg-black/40 overflow-hidden h-[180px] shadow-inner group">
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 group-hover:opacity-5 transition-opacity">
                      <span className="font-display font-black text-4xl text-white">TTD DI SINI</span>
                    </div>
                    <SignatureCanvas 
                      ref={sigCanvas}
                      penColor='white'
                      canvasProps={{
                        className: 'sigCanvas w-full h-full relative z-10',
                        style: { width: '100%', height: '100%', cursor: 'crosshair' }
                      }} 
                    />
                  </div>
                ) : (
                  <div className="h-[180px] border border-dashed border-white/10 rounded-xl flex items-center justify-center bg-black/20">
                    <span className="text-dark-300 text-sm italic">Sesi ini akan disimpan tanpa digital signature.</span>
                  </div>
                )}
                <p className="text-[10px] text-dark-300 mt-2 italic text-center">Silakan minta siswa/konseli untuk menandatangani kotak di atas.</p>
              </div>
            </form>

            <div className="p-6 border-t border-white/10 bg-dark-900/50 flex gap-3 mt-auto">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 py-3 text-sm">Batal</button>
              <button type="button" onClick={handleSubmit} className="btn-primary flex-1 bg-primary-500 py-3 gap-2 text-sm">
                <RiCheckLine className="text-lg" /> Simpan Jurnal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN UI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            Jurnal Konseling Digital
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary-500/10 text-black dark:bg-primary-500/20 dark:text-primary-300 border border-primary-500/20 dark:border-primary-500/30 shadow-sm">
              Realtime
            </span>
          </h1>
          <p className="text-dark-200 text-sm">Arsip & pencatatan sesi layanan bimbingan lengkap dengan digital signature.</p>
        </div>
        <button 
          id="konseling-add-btn" 
          onClick={() => setShowForm(true)}
          className="btn-primary text-sm py-2.5 shadow-glow-teal bg-primary-500 animate-pulse-slow"
        >
          <RiBallPenLine className="text-lg" /> Catat Sesi Baru
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Sesi', value: sessions.length, icon: RiHeartLine, color: 'text-primary-400' },
          { label: 'Bulan Ini', value: sessions.filter(s => s.tanggal.includes('Mei 2026') || s.tanggal.includes(new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }))).length, icon: RiTimeLine, color: 'text-accent-400' },
          { label: 'Tervalidasi', value: sessions.filter(s => s.signature).length, icon: RiCheckLine, color: 'text-teal-400' },
          { label: 'Siswa Unik', value: new Set(sessions.map(s => s.siswa)).size, icon: RiUserLine, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card-feature flex items-center gap-4 py-5 px-6 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-6xl"><Icon /></div>
            <div className={`p-3 rounded-xl bg-white/10 border border-white/20 ${color}`}>
              <Icon className="text-2xl" />
            </div>
            <div>
              <div className={`font-display font-black text-2xl text-white`}>{value}</div>
              <div className="text-dark-200 text-xs">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + List View */}
      <div className="card-feature p-0 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/20 bg-white/5">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab ? 'bg-primary-600/20 border border-primary-500/50 text-white' : 'text-dark-300 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="text-xs text-dark-300 hidden md:block">Menampilkan {filtered.length} arsip</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="table-header text-left py-4 px-6 bg-transparent">Subjek / Siswa</th>
                <th className="table-header text-left py-4 px-4 bg-transparent">Topik Utama</th>
                <th className="table-header text-left py-4 px-4 hidden md:table-cell bg-transparent">Klasifikasi</th>
                <th className="table-header text-center py-4 px-4 bg-transparent">Ttd</th>
                <th className="table-header text-left py-4 px-4 bg-transparent">Status</th>
                <th className="table-header text-center py-4 px-6 bg-transparent">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-white/5 transition-all group cursor-pointer">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center font-bold text-dark-300 border border-white/10 group-hover:border-primary-500/50 group-hover:text-white transition-colors">
                        {s.siswa[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-primary-300 transition-colors">{s.siswa}</div>
                        <div className="text-dark-300 text-xs flex items-center gap-1.5 mt-0.5">
                          <span className="font-medium">{s.kelas}</span> • <span className="opacity-70">{s.tanggal}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-medium text-dark-200">{s.topik}</td>
                  <td className="table-cell hidden md:table-cell"><span className={JENIS_CLS[s.jenis]}>{s.jenis}</span></td>
                  <td className="py-4 px-4 text-center">
                    {s.signature ? (
                      <div className="inline-flex p-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Tanda tangan terekam">
                        <RiBallPenLine />
                      </div>
                    ) : (
                      <div className="inline-flex p-1.5 rounded-full bg-white/10 text-dark-600" title="Belum ditanda tangani">
                        <RiBallPenLine />
                      </div>
                    )}
                  </td>
                  <td className="table-cell"><span className={STATUS_CLS[s.status]}>{s.status}</span></td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white hover:bg-primary-600 hover:border-primary-500 transition-all hide-on-print">
                        <RiFileTextLine className="text-sm" /> Detail
                      </button>
                      <button onClick={() => window.print()} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-dark-800 border border-white/20 text-xs text-white hover:bg-dark-700 transition-all hide-on-print" title="Cetak Jurnal">
                        <RiPrinterLine className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <RiFileTextLine className="text-5xl text-dark-700 mx-auto mb-3" />
              <p className="text-dark-300">Tidak ada data konseling untuk filter "{activeTab}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
