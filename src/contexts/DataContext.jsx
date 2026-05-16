import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/axios'
import toast from 'react-hot-toast'

const DataContext = createContext()

export function DataProvider({ children }) {
  const [siswa, setSiswa] = useState([])
  const [sessions, setSessions] = useState([])
  const [kasus, setKasus] = useState([])
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [akpdResult, setAkpdResult] = useState(() => {
    const saved = localStorage.getItem('simbk_data_akpd_result')
    return saved ? JSON.parse(saved) : null
  })

  const refreshData = async () => {
    try {
      setLoading(true)
      const [resSiswa, resSessions, resKasus, resSchedules] = await Promise.all([
        api.get('/students'),
        api.get('/sessions'),
        api.get('/records'),
        api.get('/schedules')
      ])
      
      setSiswa(resSiswa.data.data)
      setSessions(resSessions.data.data)
      setKasus(resKasus.data.data)
      setSchedules(resSchedules.data.data)
    } catch (err) {
      console.error('Gagal mengambil data dari API:', err)
      toast.error('Gagal memuat data dari server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  useEffect(() => {
    localStorage.setItem('simbk_data_akpd_result', JSON.stringify(akpdResult))
  }, [akpdResult])

  return (
    <DataContext.Provider value={{
      siswa, setSiswa,
      sessions, setSessions,
      kasus, setKasus,
      schedules, setSchedules,
      akpdResult, setAkpdResult,
      loading, refreshData
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
