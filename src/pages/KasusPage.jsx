import { useState } from 'react'
import {
  RiHomeHeartLine, RiMapPinLine, RiCalendarCheckLine,
  RiAddLine, RiSearchLine, RiCheckDoubleLine, RiFileList3Line, RiAlertLine,
  RiScales3Line, RiPrinterLine, RiMailSendLine, RiCloseLine, RiSaveLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'
import { useData } from '../contexts/DataContext'
import { useSettings } from '../contexts/SettingsContext'
import api from '../lib/axios'

function KasusModal({ isOpen, onClose, onSave, classes, defaultVisit = false }) {
  const [form, setForm] = useState({
    siswa: '',
    kelas: classes?.[0] || '',
    kasus: '',
    poin: 10,
    status: 'Proses',
    visit: defaultVisit
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.siswa || !form.kasus) return toast.error('Nama siswa dan deskripsi kasus wajib diisi!')
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md card-feature p-0 flex flex-col overflow-hidden animate-in">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h2 className="font-display font-bold text-white text-lg">Catat Kasus / Pelanggaran</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-dark-200 hover:text-white"><RiCloseLine /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1">Nama Siswa</label>
            <input type="text" placeholder="Nama lengkap siswa..." required className="input-field" value={form.siswa} onChange={e => setForm({...form, siswa: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1">Kelas</label>
              <select className="input-field text-sm" value={form.kelas} onChange={e => setForm({...form, kelas: e.target.value})}>
                {classes.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1">Akumulasi Poin</label>
              <input type="number" min="0" max="100" className="input-field" value={form.poin} onChange={e => setForm({...form, poin: parseInt(e.target.value) || 0})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1">Kasus / Bentuk Pelanggaran</label>
            <textarea rows="3" placeholder="Jelaskan secara singkat..." required className="input-field resize-none" value={form.kasus} onChange={e => setForm({...form, kasus: e.target.value})} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl glass border border-amber-500/20">
            <div>
              <label className="font-semibold text-white text-sm flex items-center gap-1.5"><RiHomeHeartLine className="text-amber-400"/> Butuh Home Visit?</label>
              <p className="text-dark-200 text-[10px] mt-0.5">Jadwalkan kunjungan rumah orang tua.</p>
            </div>
            <input type="checkbox" className="accent-amber-500 w-4 h-4 cursor-pointer" checked={form.visit} onChange={e => setForm({...form, visit: e.target.checked})} />
          </div>
        </form>
        <div className="p-4 border-t border-white/10 bg-dark-950/50 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 btn-secondary text-sm py-2">Batal</button>
          <button type="button" onClick={handleSubmit} className="flex-1 btn-primary text-sm py-2 gap-2 bg-primary-500"><RiSaveLine /> Simpan Kasus</button>
        </div>
      </div>
    </div>
  )
}

export default function KasusPage() {
  const { classes } = useSettings()
  const { kasus, siswa, refreshData } = useData()
  const [activeTab, setActiveTab] = useState('kasus') // kasus, homevisit
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultVisitCheck, setDefaultVisitCheck] = useState(false)

  const handleSaveKasus = async (form) => {
    // Find student ID
    const student = siswa.find(s => s.nama === form.siswa)
    if (!student) return toast.error("Siswa tidak ditemukan. Harap pastikan nama sesuai daftar.")

    try {
      await api.post('/records', {
        student_id: student.id,
        kasus: form.kasus,
        poin: form.poin,
        status: form.status,
        visit: form.visit,
        date: new Date().toISOString().split('T')[0]
      })
      
      refreshData()
      setModalOpen(false)
      toast.success('Data Kasus Kedisiplinan berhasil disimpan!')
    } catch (err) {
      toast.error('Gagal menyimpan data kasus.')
    }
  }

  const openAddModal = (withVisit = false) => {
    setDefaultVisitCheck(withVisit)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6 animate-in">
      <KasusModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleSaveKasus} 
        classes={classes} 
        defaultVisit={defaultVisitCheck}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            Buku Kasus & Poin Kedisiplinan
          </h1>
          <p className="text-dark-200 text-sm">Pencatatan pelanggaran, akumulasi poin, dan pembuatan Surat Panggilan (SP).</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openAddModal(false)} className="btn-secondary text-sm py-2"><RiAddLine /> Catat Kasus</button>
          <button onClick={() => openAddModal(true)} className="btn-primary text-sm py-2 shadow-glow-amber bg-primary-500"><RiHomeHeartLine /> Jadwal Home Visit</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-white/20">
        <div className="flex gap-6 w-max">
          <button
            onClick={() => setActiveTab('kasus')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2
              ${activeTab === 'kasus' ? 'border-primary-500 text-white' : 'border-transparent text-dark-300 hover:text-dark-300'}
            `}
          >
            <RiScales3Line className="text-lg" /> Poin & Pelanggaran
          </button>
          <button
            onClick={() => setActiveTab('homevisit')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2
              ${activeTab === 'homevisit' ? 'border-amber-500 text-white' : 'border-transparent text-dark-300 hover:text-dark-300'}
            `}
          >
            <RiHomeHeartLine className="text-lg" /> Agenda Home Visit
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'kasus' ? (
        <div className="card-feature p-0 overflow-hidden animate-in">
          <div className="p-5 border-b border-white/20 flex justify-between items-center bg-white/5">
            <div className="relative w-full max-w-xs">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-200" />
              <input
                type="text" placeholder="Cari nama siswa atau kasus..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-primary-500"
              />
            </div>
            <div className="text-xs text-dark-300 hidden sm:block">Total {kasus.length} Kasus</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-black/20 border-b border-white/10 text-dark-200 font-semibold text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 bg-transparent">Siswa</th>
                  <th className="px-4 py-4 bg-transparent">Kasus / Permasalahan</th>
                  <th className="px-4 py-4 bg-transparent">Poin</th>
                  <th className="px-4 py-4 bg-transparent">Tindak Lanjut</th>
                  <th className="px-4 py-4 bg-transparent">Status</th>
                  <th className="px-6 py-4 text-center bg-transparent">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {kasus.filter(k => k.siswa.toLowerCase().includes(searchTerm.toLowerCase()) || k.kasus.toLowerCase().includes(searchTerm.toLowerCase())).map((k) => (
                  <tr key={k.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{k.siswa}</div>
                      <div className="text-xs text-dark-300">{k.kelas}</div>
                    </td>
                    <td className="px-4 py-4 text-dark-300">{k.kasus}</td>
                    <td className="px-4 py-4">
                      <span className={`font-bold ${k.poin >= 50 ? 'text-red-400' : 'text-amber-400'}`}>+{k.poin} Poin</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        {k.visit && (
                          <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded w-max border border-amber-500/20">
                            <RiHomeHeartLine /> Home Visit
                          </span>
                        )}
                        {k.poin >= 20 && (
                          <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded w-max border border-red-500/20">
                            <RiMailSendLine /> SP Orang Tua
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                       <span className={`badge ${
                         k.status === 'Selesai' ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' :
                         k.status === 'Proses' ? 'bg-primary-500/20 text-primary-400 border-primary-500/30' :
                         'bg-dark-600/30 text-dark-200 border-white/20'
                       }`}>
                         {k.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className="flex items-center justify-center gap-2">
                         <button className="text-dark-200 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors" title="Detail Kasus"><RiFileList3Line /></button>
                         <button onClick={() => {
                           toast.success(`Surat Panggilan Orang Tua untuk ${k.siswa} siap dicetak!`)
                           window.print()
                         }} className="text-red-400 hover:text-white hover:bg-red-500/20 p-1.5 rounded-lg transition-colors" title="Cetak Surat Panggilan"><RiPrinterLine /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in">
          {kasus.filter(k => k.visit).map(k => (
             <div key={k.id} className="card-feature group border-amber-500/20 hover:border-amber-500/50 relative overflow-hidden bg-primary-500/10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300 shadow-glow-amber">
                    <RiHomeHeartLine />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-dark-200 bg-black/20 border border-white/10 px-2 py-1 rounded">{k.date}</span>
                </div>
                <h4 className="font-bold text-white text-lg">{k.siswa}</h4>
                <p className="text-dark-300 text-xs mt-1 mb-4 flex items-center gap-1"><RiMapPinLine className="text-dark-300" /> Alamat: Jl. Merdeka No. {k.id * 12}</p>
                
                <div className="p-3 bg-black/40 rounded-xl border border-white/10 shadow-inner mb-4">
                   <div className="text-[10px] text-dark-300 uppercase font-bold tracking-wider mb-1">Terkait Kasus</div>
                   <div className="text-sm text-amber-100 font-medium">{k.kasus}</div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 btn-primary bg-amber-600 hover:bg-amber-500 border-none py-2 text-xs shadow-glow-amber" onClick={() => toast.success('Status kunjungan diperbarui!')}>
                    <RiCheckDoubleLine /> Tandai Selesai
                  </button>
                  <button className="btn-secondary py-2 px-3 text-dark-300 hover:text-white" title="Laporan Kunjungan">
                    <RiFileList3Line />
                  </button>
                </div>
             </div>
          ))}
        </div>
      )}
    </div>
  )
}
