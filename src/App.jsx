import { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Auth/Login'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import TaskDetails from './components/TaskList/TaskDetails'
import EditProfile from './components/Auth/EditProfile'
import AddEmployee from './components/Auth/AddEmployee'
import EmployeeTasksView from './components/Admin/EmployeeTasksView'
import { AuthContext } from './context/AuthProvider'
import axios from 'axios'

const App = () => {
  const { user, setUser } = useContext(AuthContext)

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const userData = response.data;

      if (userData) {
        setUser(userData);
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
      }
    } catch (error) {
      alert("Invalid credentials or server error");
      console.error("Login error:", error);
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          !user ? <Login handleLogin={handleLogin} /> :
            (user.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard data={user} />)
        } />
        <Route path="/task/:taskId" element={user ? <TaskDetails /> : <Navigate to="/" />} />
        <Route path="/edit-profile" element={user ? <EditProfile /> : <Navigate to="/" />} />
        <Route path="/add-employee" element={user?.role === 'admin' ? <AddEmployee /> : <Navigate to="/" />} />
        <Route path="/employee-tasks/:employeeId" element={user?.role === 'admin' ? <EmployeeTasksView /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
export default App