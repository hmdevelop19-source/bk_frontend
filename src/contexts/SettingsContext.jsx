import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/axios'
import toast from 'react-hot-toast'

const SettingsContext = createContext()

const DEFAULT_CLASSES = ['X IPA 1', 'X IPA 2', 'X IPS 1', 'XI IPA 1', 'XI IPA 2', 'XI IPS 3', 'XII IPA 1', 'XII IPS 2']

export function SettingsProvider({ children }) {
  const [classes, setClasses] = useState(DEFAULT_CLASSES)
  const [sekolah, setSekolah] = useState({
    nama: '',
    npsn: '',
    alamat: '',
    kepsek: '',
    nip_kepsek: '',
    logo: null,
    ttd: null,
  })

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings')
      if (res.data) {
        if (res.data.classes) {
          setClasses(typeof res.data.classes === 'string' ? JSON.parse(res.data.classes) : res.data.classes)
        }
        if (res.data.sekolah) {
          setSekolah(typeof res.data.sekolah === 'string' ? JSON.parse(res.data.sekolah) : res.data.sekolah)
        }
      }
    } catch (err) {
      console.error('Gagal mengambil pengaturan:', err)
    }
  }

  const updateSettings = async (key, value) => {
    try {
      await api.post('/settings', { [key]: value })
      if (key === 'classes') setClasses(value)
      if (key === 'sekolah') setSekolah(value)
      toast.success('Pengaturan berhasil disimpan')
    } catch (err) {
      toast.error('Gagal menyimpan pengaturan')
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{ classes, setClasses: (v) => updateSettings('classes', v), sekolah, setSekolah: (v) => updateSettings('sekolah', v) }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
