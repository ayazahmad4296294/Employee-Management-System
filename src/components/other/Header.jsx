import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { useNavigate } from 'react-router-dom'

const Header = (props) => {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const logOutUser = () => {
    localStorage.setItem('loggedInUser', '')
    setUser(null)
    navigate('/')
  }

  return (
    <div className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl gap-4 md:gap-0'>
      <div className='flex flex-col'>
        <span className='text-gray-400 text-sm font-medium uppercase tracking-wider'>Welcome back,</span>
        <span className='text-2xl md:text-3xl font-bold text-white tracking-tight leading-none mt-1'>
          {props.data ? props.data.firstName : 'Admin'} 👋
        </span>
        {props.data?.designation && (
          <span className='text-emerald-400 text-xs md:text-sm font-medium uppercase tracking-widest mt-1 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20'>
            {props.data.designation}
          </span>
        )}
      </div>

      <div className='flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto'>
        {user?.role === 'admin' && (
          <button
            onClick={() => {
              console.log('Navigating to add-employee');
              navigate('/add-employee');
            }}
            className='w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-base md:text-lg transition-all active:scale-[0.98] whitespace-nowrap'
          >
            Add Employee
          </button>
        )}
        <button
          onClick={() => navigate('/edit-profile')}
          className='w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-6 rounded-xl text-base md:text-lg transition-all active:scale-[0.98] whitespace-nowrap'
        >
          Edit Profile
        </button>
        <button
          onClick={logOutUser}
          className='w-full sm:w-auto group relative flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl text-base md:text-lg transition-all duration-300 shadow-lg shadow-emerald-900/10 active:scale-[0.98] overflow-hidden whitespace-nowrap'
        >
          <span className='relative z-10'>Log Out</span>
          <div className='absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700'></div>
        </button>
      </div>
    </div>
  )
}

export default Header