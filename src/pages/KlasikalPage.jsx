import { useState } from 'react'
import {
  RiPresentationLine, RiTeamLine, RiCalendarCheckLine, RiFileTextLine,
  RiCheckLine, RiCloseLine, RiGroupLine, RiHistoryLine, RiArrowRightLine,
  RiSaveLine, RiPrinterLine, RiSearchLine, RiTimeLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'
import { useData } from '../contexts/DataContext'
import { useSettings } from '../contexts/SettingsContext'
import api from '../lib/axios'

const SAMPLE_STUDENTS = [
  { id: 1, name: 'Ahmad Fauzi', nis: '2024001', status: 'Hadir' },
  { id: 2, name: 'Annisa Zahra', nis: '2024002', status: 'Hadir' },
  { id: 3, name: 'Bagus Pratama', nis: '2024003', status: 'Hadir' },
  { id: 4, name: 'Budi Santoso', nis: '2024004', status: 'Sakit' },
  { id: 5, name: 'Citra Ayu', nis: '2024005', status: 'Hadir' },
  { id: 6, name: 'Dedi Kusuma', nis: '2024006', status: 'Hadir' },
  { id: 7, name: 'Dewi Lestari', nis: '2024007', status: 'Izin' },
  { id: 8, name: 'Eko Wahyudi', nis: '2024008', status: 'Hadir' },
  { id: 9, name: 'Fahmi Idris', nis: '2024009', status: 'Hadir' },
  { id: 10, name: 'Gita Putri', nis: '2024010', status: 'Hadir' },
]

function JadwalKlasikalModal({ isOpen, onClose, onSave, classes }) {
  const [form, setForm] = useState({
    class: classes?.[0] || '',
    topic: '',
    time: '',
    total: 36
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.class || !form.topic || !form.time) return toast.error('Harap isi semua kolom jadwal!')
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md card-feature p-0 flex flex-col overflow-hidden animate-in">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h2 className="font-display font-bold text-white text-lg">Buat Jadwal Klasikal</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-dark-200 hover:text-white"><RiCloseLine /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1">Pilih Kelas</label>
            <select className="input-field text-sm" value={form.class} onChange={e => setForm({...form, class: e.target.value})}>
              {classes.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1">Topik Bimbingan / Layanan</label>
            <input type="text" placeholder="Cth: Bahaya Bullying & Dampaknya" required className="input-field text-sm" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1">Hari & Jam</label>
              <input type="text" placeholder="Cth: Senin, 08:00" required className="input-field text-sm" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1">Total Siswa</label>
              <input type="number" min="1" max="50" className="input-field text-sm" value={form.total} onChange={e => setForm({...form, total: parseInt(e.target.value) || 30})} />
            </div>
          </div>
        </form>
        <div className="p-4 border-t border-white/10 bg-dark-950/50 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 btn-secondary text-sm py-2">Batal</button>
          <button type="button" onClick={handleSubmit} className="flex-1 btn-primary text-sm py-2 gap-2 bg-primary-500"><RiSaveLine /> Buat Jadwal</button>
        </div>
      </div>
    </div>
  )
}

export default function KlasikalPage() {
  const { classes } = useSettings()
  const { schedules, refreshData } = useData()
  const [view, setView] = useState('list') // 'list' or 'attendance'
  const [activeClass, setActiveClass] = useState(null)
  const [students, setStudents] = useState(SAMPLE_STUDENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const handleOpenAttendance = (schedule) => {
    setActiveClass(schedule)
    setView('attendance')
  }

  const handleStatusChange = (studentId, newStatus) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, status: newStatus } : s))
  }

  const handleSaveAttendance = () => {
    toast.success(`Daftar hadir kelas ${activeClass.class} berhasil disimpan!`, {
      icon: '📋',
    })
    setView('list')
  }

  const handleSaveSchedule = async (form) => {
    try {
      await api.post('/schedules', {
        class_name: form.class,
        topic: form.topic,
        time: form.time,
        status: 'Terjadwal',
        attended: 0,
        total: form.total
      })
      
      refreshData()
      setModalOpen(false)
      toast.success('Jadwal Bimbingan Klasikal baru berhasil dibuat!')
    } catch (err) {
      toast.error('Gagal membuat jadwal baru.')
    }
  }

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nis.includes(searchTerm)
  )

  return (
    <div className="space-y-6 animate-in">
      <JadwalKlasikalModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleSaveSchedule} 
        classes={classes} 
      />

      {view === 'list' ? (
        <>
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
                Bimbingan Klasikal
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary-500/10 text-black dark:bg-primary-500/20 dark:text-primary-300 border border-primary-500/20 dark:border-primary-500/30 shadow-sm">
                  Grup
                </span>
              </h1>
              <p className="text-dark-200 text-sm">Jadwal masuk kelas & manajemen kehadiran peserta didik secara kolektif.</p>
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary gap-2 py-2.5 shadow-glow-indigo">
              <RiPresentationLine className="text-lg" /> Buat Jadwal Baru
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Sesi Bulan Ini', val: `${schedules.length} Kali`, icon: RiHistoryLine, color: 'text-indigo-400' },
              { label: 'Jam Layanan', val: `${schedules.length * 2} JP`, icon: RiTimeLine, color: 'text-emerald-400' },
              { label: 'Tingkat Kehadiran', val: '96.5%', icon: RiGroupLine, color: 'text-accent-400' },
            ].map(item => (
              <div key={item.label} className="card-feature flex items-center gap-4 py-5">
                <div className="p-3 rounded-xl bg-white/10 text-2xl border border-white/20">{<item.icon className={item.color}/>}</div>
                <div>
                  <div className="text-2xl font-display font-black text-white">{item.val}</div>
                  <div className="text-xs text-dark-200">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CLASS SCHEDULE GRID */}
          <h3 className="text-white font-display font-bold mt-8 mb-2">Agenda Minggu Ini</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schedules.map((item) => (
              <div key={item.id} className="card-feature group border-white/20 hover:border-primary-500/30 relative overflow-hidden">
                {item.status === 'Berlangsung' && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-[9px] font-bold text-white uppercase px-3 py-1 rounded-bl-xl animate-pulse">Live Now</div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-display font-black text-primary-400 text-lg group-hover:scale-110 transition-transform duration-300">
                    {item.class.split(' ')[0]}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    item.status === 'Selesai' ? 'bg-white/10 text-dark-200 border-white/20' :
                    item.status === 'Berlangsung' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>{item.status}</span>
                </div>

                <h4 className="font-bold text-white text-lg group-hover:text-primary-300 transition-colors">{item.class}</h4>
                <p className="text-dark-300 text-sm mt-1 font-medium line-clamp-1">{item.topic}</p>

                <div className="flex items-center gap-2 text-dark-300 text-xs mt-4 bg-white/5 p-2 rounded-lg">
                  <RiCalendarCheckLine className="text-primary-400" />
                  {item.time}
                </div>

                <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-dark-200">
                    <RiTeamLine /> {item.status === 'Selesai' ? `${item.attended}/${item.total} Hadir` : `${item.total} Siswa`}
                  </div>
                  <button 
                    onClick={() => handleOpenAttendance(item)}
                    className={`flex items-center gap-1 text-xs font-bold py-1.5 px-3 rounded-lg transition-all ${
                      item.status === 'Selesai' ? 'bg-white/10 text-dark-200 hover:bg-dark-700' : 'bg-primary-600 text-white hover:bg-primary-500 shadow-glow-sm'
                    }`}
                  >
                    {item.status === 'Selesai' ? 'Detail' : 'Presensi'} <RiArrowRightLine />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* ATTENDANCE ENTRY MODE */
        <div className="animate-in">
          {/* ATTENDANCE HEADER */}
          <div className="card-feature p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-primary-500 border-indigo-500/30 mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('list')} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                <RiCloseLine className="text-2xl" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-black rounded uppercase tracking-wider">Presensi Klasikal</span>
                  <h2 className="font-display font-bold text-xl text-white">{activeClass?.class}</h2>
                </div>
                <p className="text-indigo-300 text-sm mt-0.5 flex items-center gap-1"><RiFileTextLine /> {activeClass?.topic}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:flex-none md:w-64">
                 <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-200" />
                 <input 
                    type="text" placeholder="Cari nama/NIS..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-white/10/80 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                  />
               </div>
               <button onClick={handleSaveAttendance} className="btn-primary bg-primary-500 gap-2 py-2 text-sm shadow-glow-teal whitespace-nowrap">
                 <RiSaveLine /> Simpan Kehadiran
               </button>
            </div>
          </div>

          {/* QUICK STATS IN ATTENDANCE */}
          <div className="flex flex-wrap gap-2 mb-5">
            <div className="bg-white/10/80 px-4 py-2 rounded-xl border border-white/20 text-xs text-white"><span className="text-dark-200">Hadir:</span> <b className="text-emerald-400 text-sm ml-1">{students.filter(s=>s.status==='Hadir').length}</b></div>
            <div className="bg-white/10/80 px-4 py-2 rounded-xl border border-white/20 text-xs text-white"><span className="text-dark-200">Izin:</span> <b className="text-blue-400 text-sm ml-1">{students.filter(s=>s.status==='Izin').length}</b></div>
            <div className="bg-white/10/80 px-4 py-2 rounded-xl border border-white/20 text-xs text-white"><span className="text-dark-200">Sakit:</span> <b className="text-amber-400 text-sm ml-1">{students.filter(s=>s.status==='Sakit').length}</b></div>
            <div className="bg-white/10/80 px-4 py-2 rounded-xl border border-white/20 text-xs text-white"><span className="text-dark-200">Alfa:</span> <b className="text-red-400 text-sm ml-1">{students.filter(s=>s.status==='Alfa').length}</b></div>
          </div>

          {/* ATTENDANCE TABLE GRID */}
          <div className="card-feature p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-dark-900 border-b border-white/20 text-dark-200 font-semibold text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">No</th>
                    <th className="px-4 py-4">NIS & Nama Siswa</th>
                    <th className="px-6 py-4 text-center">Opsi Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredStudents.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-dark-300 font-mono">{idx + 1}</td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-white">{student.name}</div>
                        <div className="text-xs text-dark-300">{student.nis}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {[
                            { label: 'H', full: 'Hadir', c: 'emerald' },
                            { label: 'I', full: 'Izin', c: 'blue' },
                            { label: 'S', full: 'Sakit', c: 'amber' },
                            { label: 'A', full: 'Alfa', c: 'red' },
                          ].map(opt => {
                            const isSelected = student.status === opt.full;
                            const baseColorClass = 
                              opt.c === 'emerald' ? (isSelected ? 'bg-emerald-500 text-white shadow-glow-sm border-emerald-400' : 'hover:border-emerald-500/50 text-emerald-500/70') :
                              opt.c === 'blue' ? (isSelected ? 'bg-blue-500 text-white shadow-glow-sm border-blue-400' : 'hover:border-blue-500/50 text-blue-500/70') :
                              opt.c === 'amber' ? (isSelected ? 'bg-amber-500 text-white shadow-glow-sm border-amber-400' : 'hover:border-amber-500/50 text-amber-500/70') :
                              (isSelected ? 'bg-red-500 text-white shadow-glow-sm border-red-400' : 'hover:border-red-500/50 text-red-500/70');

                            return (
                              <button
                                key={opt.full}
                                onClick={() => handleStatusChange(student.id, opt.full)}
                                className={`w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center font-bold text-xs transition-all duration-200 ${baseColorClass}`}
                                title={opt.full}
                              >
                                {opt.label}
                              </button>
                            )
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
