import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import OrganizationsList from './pages/OrganizationsList'
import OrganizationForm from './pages/OrganizationForm'
import Masters from './pages/Masters'
import UploadCertificate from './pages/UploadCertificate'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Streams from "./pages/academics/Streams";
import Disciplines from "./pages/academics/Disciplines";
import Programs from "./pages/academics/Programs";
import Courses from "./pages/academics/Courses";
import ProgramCourseMapping from "./pages/academics/ProgramCourseMapping";
import AssignProgramToCollege from "./pages/academics/AssignProgramToCollege";
export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/' element={<ProtectedRoute><Layout/></ProtectedRoute>}>
          <Route path='dashboard' element={<Dashboard/>} />
          <Route path='organizations' element={<OrganizationsList/>} />
          <Route path='organizations/:id' element={<OrganizationForm/>} />
          <Route path='masters' element={<Masters/>} />
          <Route path='upload' element={<UploadCertificate/>} />
          <Route path="/academics/streams" element={<Streams />} />
  <Route path="/academics/disciplines" element={<Disciplines />} />
  <Route path="/academics/programs" element={<Programs />} />
  <Route path="/academics/courses" element={<Courses />} />
  <Route path="/academics/mapping" element={<ProgramCourseMapping />} />
  <Route path="/academics/assign-program" element={<AssignProgramToCollege />} />
          <Route index element={<Dashboard/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
