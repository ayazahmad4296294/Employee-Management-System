import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../context/AuthProvider'
import Header from '../other/Header'

const TaskDetails = () => {
    const { taskId } = useParams()
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const [task, setTask] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}`)
                setTask(response.data)
            } catch (error) {
                console.error("Error fetching task:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTask()
    }, [taskId])

    if (loading) return <div className='p-10 text-white'>Loading task details...</div>
    if (!task) return <div className='p-10 text-white'>Task not found!</div>

    return (
        <div className='min-h-screen w-full bg-[#0a0a0a] relative p-6 md:p-10 lg:px-12 lg:py-8 text-white'>
            <Header data={user} />

            <div className='mt-10 lg:mt-8 bg-white/5 backdrop-blur-xl border border-white/10 p-8 lg:p-6 rounded-3xl max-w-4xl mx-auto'>
                <button
                    onClick={() => navigate(-1)}
                    className='text-emerald-400 hover:text-emerald-300 mb-6 lg:mb-4 flex items-center gap-2 transition-all'
                >
                    ← Back to Dashboard
                </button>

                <div className='flex justify-between items-start mb-6 lg:mb-4'>
                    <div>
                        <h1 className='text-4xl lg:text-3xl font-bold mb-2'>{task.title}</h1>
                        <span className='bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20'>
                            {task.category}
                        </span>
                    </div>
                    <div className='text-right'>
                        <p className='text-gray-400 text-sm'>Assigned to: <span className='text-white font-medium'>{task.assignedTo?.firstName}</span></p>
                        <p className='text-gray-400 text-sm'>Date: <span className='text-white font-medium'>{new Date(task.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                    </div>
                </div>

                <div className='border-t border-white/5 pt-6 lg:pt-4'>
                    <h3 className='text-gray-400 font-bold uppercase text-sm tracking-wider mb-4 lg:mb-2'>Description</h3>
                    <p className='text-gray-300 leading-relaxed text-lg lg:text-base'>
                        {task.description}
                    </p>
                </div>

                <div className='mt-10 lg:mt-6 flex gap-4'>
                    {user?.role === 'employee' && task.status === 'new' && (
                        <button className='bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 lg:py-2.5 lg:px-6 rounded-xl transition-all'>
                            Accept Task
                        </button>
                    )}
                    {user?.role === 'admin' && (
                        <button className='bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-bold py-3 px-8 lg:py-2.5 lg:px-6 rounded-xl border border-red-600/30 transition-all'>
                            Delete Task
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TaskDetails
