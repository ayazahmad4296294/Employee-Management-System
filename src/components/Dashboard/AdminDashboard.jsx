import React, { useContext } from 'react'
import Header from '../other/Header'
import CreateTask from '../other/CreateTask'
import AllTask from '../other/AllTask'
import AdminOverdueTasks from './AdminOverdueTasks'
import { AuthContext } from '../../context/AuthProvider'

const AdminDashboard = () => {
    const { user } = useContext(AuthContext)

    return (
        <div className='min-h-screen w-full bg-[#0a0a0a] relative overflow-hidden'>
            {/* Background decorative elements */}
            <div className='absolute w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] -top-20 -left-20 animate-pulse'></div>
            <div className='absolute w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] -bottom-20 -right-20 animate-pulse' style={{ animationDelay: '1s' }}></div>

            <div className='relative z-10 p-6 md:p-10'>
                <Header data={user} />
                <CreateTask />
                <AdminOverdueTasks />
                <AllTask />
            </div>
        </div>
    )
}

export default AdminDashboard