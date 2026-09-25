import { useCallback, useEffect, useState } from "react"
import { dummyAttendanceData } from "../assets/assets"
import Loading from "../components/Loading"
import CheckInButton from "../components/Attendance/CheckInButton"
import AttendanceStats from "../components/Attendance/AttendanceStats"
import AttendanceHistory from "../components/Attendance/AttendanceHistory"
import api from "../api/axios"
import toast from "react-hot-toast"


const Attendance = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/attendance");
      const json = res.data;
      setHistory(json.data || [])
      if(json.employee?.isDeleted) setIsDeleted(true)
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <Loading />

  const getDateKey = (value) => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });

    const parts = formatter.formatToParts(value ? new Date(value) : new Date());
    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;

    return `${year}-${month}-${day}`;
  };

  const todayKey = getDateKey();
  const todayRecord = history.find((r) => getDateKey(r.date) === todayKey)

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Track your work hours and daily check-ins</p>
      </div>

      {isDeleted ? (
        <div className="mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
          <p className="text-rose-600">Attendance actions are unavailable because your employee record is no longer active.</p>
        </div>
      ) : (
        <div className="mb-8">
          <CheckInButton todayRecord={todayRecord} onAction={fetchData}/>
        </div>
      )}

      <AttendanceStats history={history}/>
      <AttendanceHistory history={history}/>
    </div>
  )
}

export default Attendance
