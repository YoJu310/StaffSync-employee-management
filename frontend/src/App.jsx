import { Toaster } from "react-hot-toast"
import { Navigate, Route, Routes } from "react-router-dom"
import LoginLanding from "./pages/LoginLanding"
import LoginForm from "./components/LoginForm"

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={ <LoginLanding /> } />
        <Route path="/login" element={ <LoginLanding /> } />

        <Route path="/login/admin" element={ <LoginForm role="admin" title="Admin Portal" subtitle="Sign in to manage the organization"/> } />

        <Route path="/login/employee" element={ <LoginForm role="employee" title="Employee Portal" subtitle="Sign in to manage your account" /> } />
  
      </Routes>
    </>
  )
}

export default App
