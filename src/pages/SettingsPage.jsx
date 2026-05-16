import { useState } from 'react'
import {
  RiShieldStarLine, RiUserLine, RiLockLine, RiBellLine,
  RiPaletteLine, RiSaveLine, RiBuildingLine, RiGroupLine,
  RiUploadCloud2Line, RiDeleteBinLine, RiAddLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'

export default function SettingsPage() {
  const { user } = useAuth()
  const { classes, setClasses, sekolah, setSekolah } = useSettings()
  const [activeTab, setActiveTab] = useState('profil')
  const [newClass, setNewClass] = useState('')

  const tabs = [
    { id: 'profil', label: 'Profil Guru BK', icon: RiUserLine },
    { id: 'sekolah', label: 'Profil Sekolah', icon: RiBuildingLine },
    { id: 'kelas', label: 'Manajemen Kelas', icon: RiGroupLine },
    { id: 'keamanan', label: 'Keamanan', icon: RiLockLine },
    { id: 'notifikasi', label: 'Notifikasi', icon: RiBellLine },
    { id: 'aplikasi', label: 'Aplikasi', icon: RiPaletteLine },
  ]

  const handleSave = () => toast.success('Konfigurasi berhasil diperbarui!')

  const handleAddClass = () => {
    if (newClass.trim() && !classes.includes(newClass.trim())) {
      setClasses([...classes, newClass.trim()])
      setNewClass('')
      toast.success('Kelas berhasil ditambahkan!')
    }
  }

  const removeClass = (c) => {
    setClasses(classes.filter(x => x !== c))
    toast.success('Kelas dihapus!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Pengaturan</h1>
        <p className="text-dark-200 text-sm">Kelola profil dan konfigurasi sistem SIMBK</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="card-feature p-2 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id ? 'bg-primary-500 text-white shadow-glow-sm' : 'text-dark-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="text-lg" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 card-feature space-y-6">
          {activeTab === 'profil' && (
            <>
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Profil Pengguna</h2>
                <p className="text-dark-200 text-sm">Perbarui informasi akun Guru BK</p>
              </div>
              <div className="flex items-center gap-4 p-4 glass rounded-xl">
                <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center text-2xl font-bold text-white shadow-glow-sm">
                  {user?.name?.[0]?.toUpperCase() || 'G'}
                </div>
                <div>
                  <p className="font-semibold text-white">{user?.name || 'Guru BK'}</p>
                  <p className="text-dark-200 text-sm">{user?.email || 'guru@sekolah.id'}</p>
                  <button className="text-primary-400 text-xs mt-1 hover:text-primary-300 transition-colors">Ganti Foto</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Nama Lengkap (Guru BK)', placeholder: user?.name || 'Nama Guru BK', type: 'text' },
                  { label: 'NIP / NIK', placeholder: '1234567890', type: 'text' },
                  { label: 'Email', placeholder: user?.email || 'guru@sekolah.id', type: 'email' },
                  { label: 'Nomor HP', placeholder: '+62 8xx-xxxx-xxxx', type: 'tel' },
                ].map(({ label, placeholder, type }) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-dark-300 mb-2">{label}</label>
                    <input type={type} placeholder={placeholder} className="input-field" />
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'sekolah' && (
            <div className="animate-in">
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Profil Sekolah & Identitas</h2>
                <p className="text-dark-200 text-sm">Data akan digunakan secara otomatis untuk kop surat dan pelaporan BK.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Nama Sekolah</label>
                  <input type="text" placeholder="SMA Negeri 1 ..." className="input-field" value={sekolah.nama || ''} onChange={e => setSekolah({...sekolah, nama: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">NPSN</label>
                  <input type="text" placeholder="12345678" className="input-field" value={sekolah.npsn || ''} onChange={e => setSekolah({...sekolah, npsn: e.target.value})} />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-dark-300 mb-2">Alamat Lengkap</label>
                  <input type="text" placeholder="Jl. Pendidikan No.1" className="input-field" value={sekolah.alamat || ''} onChange={e => setSekolah({...sekolah, alamat: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Nama Kepala Sekolah</label>
                  <input type="text" placeholder="Nama Kepala Sekolah, M.Pd." className="input-field" value={sekolah.kepsek || ''} onChange={e => setSekolah({...sekolah, kepsek: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">NIP Kepala Sekolah</label>
                  <input type="text" placeholder="19800101 200501 1 001" className="input-field" value={sekolah.nip_kepsek || ''} onChange={e => setSekolah({...sekolah, nip_kepsek: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Logo / Kop Surat</label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer bg-white/5">
                    <RiUploadCloud2Line className="text-3xl text-primary-400 mb-2" />
                    <span className="text-sm text-white font-medium">Upload Logo Sekolah</span>
                    <span className="text-xs text-dark-300 mt-1">PNG/JPG (Maks 2MB)</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Tanda Tangan Kepala Sekolah</label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer bg-white/5">
                    <RiUploadCloud2Line className="text-3xl text-primary-400 mb-2" />
                    <span className="text-sm text-white font-medium">Upload File Tanda Tangan</span>
                    <span className="text-xs text-dark-300 mt-1">PNG Transparan disarankan</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kelas' && (
            <div className="animate-in">
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Manajemen Kelas</h2>
                <p className="text-dark-200 text-sm">Daftar kelas yang tersedia di sistem untuk penjurusan siswa.</p>
              </div>
              <div className="flex gap-2 mt-6">
                <input 
                  type="text" 
                  placeholder="Nama kelas baru (cth: X IPA 3)" 
                  className="input-field flex-1"
                  value={newClass}
                  onChange={e => setNewClass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddClass()}
                />
                <button onClick={handleAddClass} className="btn-primary py-2 px-4 whitespace-nowrap">
                  <RiAddLine /> Tambah Kelas
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
                {classes.map(c => (
                  <div key={c} className="flex items-center justify-between p-3 rounded-xl glass border-white/10 group bg-white/5">
                    <span className="text-sm font-semibold text-white">{c}</span>
                    <button 
                      onClick={() => removeClass(c)} 
                      className="text-dark-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                      title="Hapus Kelas"
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'keamanan' && (
            <div className="animate-in">
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Keamanan Akun</h2>
                <p className="text-dark-200 text-sm">Perbarui password akun Anda</p>
              </div>
              <div className="space-y-4 max-w-md mt-6">
                {['Password Lama', 'Password Baru', 'Konfirmasi Password Baru'].map(label => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-dark-300 mb-2">{label}</label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifikasi' && (
            <div className="animate-in">
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Notifikasi</h2>
                <p className="text-dark-200 text-sm">Atur preferensi notifikasi sistem</p>
              </div>
              <div className="space-y-3 mt-6">
                {[
                  'Pengingat jadwal konseling',
                  'Laporan bulanan otomatis',
                  'Notifikasi siswa baru',
                  'Alert siswa bermasalah',
                  'Update sistem SIMBK',
                ].map(item => (
                  <label key={item} className="flex items-center justify-between p-4 glass rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                    <span className="text-dark-200 text-sm">{item}</span>
                    <div className="relative">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-primary-500 transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'aplikasi' && (
            <div className="animate-in">
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Pengaturan Aplikasi</h2>
                <p className="text-dark-200 text-sm">Konfigurasi tampilan dan perilaku SIMBK</p>
              </div>
              <div className="p-4 glass rounded-xl mt-6">
                <div className="flex items-center gap-3">
                  <RiShieldStarLine className="text-primary-400 text-2xl" />
                  <div>
                    <p className="font-semibold text-white text-sm">SIMBK v1.0.0</p>
                    <p className="text-dark-200 text-xs">Sistem Informasi Manajemen Bimbingan dan Konseling</p>
                    <p className="text-dark-300 text-xs">CV. Alifba Media © {new Date().getFullYear()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-white/20">
            <button id="settings-save-btn" onClick={handleSave} className="btn-primary py-2.5">
              <RiSaveLine /> Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
