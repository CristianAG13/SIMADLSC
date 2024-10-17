import { Navigate, Route, Routes } from "react-router-dom"
import SimadPage from "../SimadPage"
import LoginPage from "../../../auth/pages/LoginPage"


export const SimadRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={ <SimadPage /> } />

        <Route path="/*" element={ <Navigate to="/" /> } />
        
        <Route path="/login" element={ <LoginPage /> } /> 
    </Routes>
  )
}
