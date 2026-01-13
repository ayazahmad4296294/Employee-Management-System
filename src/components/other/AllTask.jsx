import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AllTask = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users')
      const sortedEmployees = response.data.sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
      )
      setEmployees(sortedEmployees)
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEmployee = async (employeeId, employeeName) => {
    const confirmed = window.confirm(`Are you sure you want to permanently delete ${employeeName}'s account? This action cannot be undone.`)

    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${employeeId}`)
        alert(`${employeeName}'s account has been deleted successfully.`)
        fetchEmployees() // Refresh the list
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete employee")
        console.error("Error deleting employee:", error)
      }
    }
  }

  if (loading) return <div className='p-10 text-white'>Loading employees...</div>

  return (
    <div id='alltask' className='bg-white/5 backdrop-blur-xl border border-white/10 p-5 md:p-8 lg:p-6 mt-6 md:mt-10 lg:mt-6 rounded-2xl md:rounded-3xl'>
      <div className='bg-white/5 border border-white/5 mb-4 lg:mb-3 py-3 px-6 lg:py-2 lg:px-6 hidden md:flex justify-between rounded-xl sticky top-0 backdrop-blur-md z-10'>
        <h2 className='text-gray-400 font-bold w-1/6 uppercase text-sm lg:text-xs tracking-wider'>Employee</h2>
        <h3 className='text-gray-400 font-bold w-1/6 uppercase text-sm lg:text-xs tracking-wider text-center'>New Task</h3>
        <h5 className='text-gray-400 font-bold w-1/6 uppercase text-sm lg:text-xs tracking-wider text-center'>Active Task</h5>
        <h5 className='text-gray-400 font-bold w-1/6 uppercase text-sm lg:text-xs tracking-wider text-center'>Completed</h5>
        <h5 className='text-gray-400 font-bold w-1/6 uppercase text-sm lg:text-xs tracking-wider text-center'>Failed</h5>
        <h5 className='text-gray-400 font-bold w-1/6 uppercase text-sm lg:text-xs tracking-wider text-center'>Delete Account</h5>
      </div>

      <div className='space-y-3 lg:space-y-2'>
        {employees.length > 0 ? (
          employees.map((employee, idx) => (
            <div
              key={idx}
              className='bg-white/5 border border-white/5 hover:bg-white/10 transition-all py-4 px-5 md:py-3 md:px-6 lg:py-2.5 lg:px-6 flex flex-col md:flex-row justify-between items-start md:items-center rounded-xl group gap-3 md:gap-0'
            >
              <h2
                onClick={() => navigate(`/employee-tasks/${employee._id}`)}
                className='text-white font-medium text-lg lg:text-sm w-full md:w-1/6 group-hover:px-0 md:group-hover:px-2 transition-all cursor-pointer mb-2 md:mb-0'
              >
                {employee.firstName}
              </h2>
              <div className='flex justify-between w-full md:block md:w-1/6 items-center'>
                <span className='md:hidden text-gray-400 text-sm uppercase'>New:</span>
                <h3 className='text-blue-500 font-bold text-center text-lg lg:text-base'>{employee?.taskCounters?.newTask || 0}</h3>
              </div>
              <div className='flex justify-between w-full md:block md:w-1/6 items-center'>
                <span className='md:hidden text-gray-400 text-sm uppercase'>Active:</span>
                <h5 className='text-yellow-400 font-bold text-center text-lg lg:text-base'>{employee?.taskCounters?.active || 0}</h5>
              </div>
              <div className='flex justify-between w-full md:block md:w-1/6 items-center'>
                <span className='md:hidden text-gray-400 text-sm uppercase'>Completed:</span>
                <h5 className='text-green-500 font-bold text-center text-lg lg:text-base'>{employee?.taskCounters?.completed || 0}</h5>
              </div>
              <div className='flex justify-between w-full md:block md:w-1/6 items-center'>
                <span className='md:hidden text-gray-400 text-sm uppercase'>Failed:</span>
                <h5 className='text-red-600 font-bold text-center text-lg lg:text-base'>{employee?.taskCounters?.failed || 0}</h5>
              </div>

              <div className='w-full md:w-1/6 flex justify-end md:justify-center mt-2 md:mt-0'>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteEmployee(employee._id, employee.firstName)
                  }}
                  className='w-full md:w-auto bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 md:py-2 px-4 lg:py-1.5 lg:px-3 rounded-lg shadow-lg shadow-red-900/20 transition-all active:scale-95'
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center py-10'>
            <p className='text-gray-500 text-lg'>No employees found. 👥</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllTask