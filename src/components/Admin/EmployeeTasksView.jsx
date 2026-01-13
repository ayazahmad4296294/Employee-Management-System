import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import TaskList from '../TaskList/TaskList'

const EmployeeTasksView = () => {
    const { employeeId } = useParams()
    const navigate = useNavigate()
    const [employee, setEmployee] = useState(null)
    const [allTasks, setAllTasks] = useState([])
    const [filteredTasks, setFilteredTasks] = useState([])
    const [activeFilter, setActiveFilter] = useState('all')
    const [allEmployees, setAllEmployees] = useState([])
    const [reassignTarget, setReassignTarget] = useState(null)
    const [newAssignee, setNewAssignee] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch employee details
                const empResponse = await axios.get(`http://localhost:5000/api/users/${employeeId}`)
                setEmployee(empResponse.data)

                // Fetch ALL employees for reassignment dropdown
                const usersResponse = await axios.get('http://localhost:5000/api/users')
                setAllEmployees(usersResponse.data)

                // Fetch employee's tasks
                const tasksResponse = await axios.get('http://localhost:5000/api/tasks', {
                    headers: {
                        role: 'employee',
                        userid: employeeId
                    }
                })
                setAllTasks(tasksResponse.data)
                setFilteredTasks(tasksResponse.data)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [employeeId])

    const filterTasks = (status) => {
        setActiveFilter(status)
        if (status === 'all') {
            setFilteredTasks(allTasks)
        } else {
            setFilteredTasks(allTasks.filter(task => task.status === status))
        }
    }

    const getStatusCount = (status) => {
        return allTasks.filter(task => task.status === status).length
    }

    const handleReassignSubmit = async () => {
        if (!newAssignee) return alert("Please select an employee");
        try {
            await axios.put(`http://localhost:5000/api/tasks/${reassignTarget._id}/reassign`, {
                assignedTo: newAssignee
            });
            alert("Task reassigned successfully!");
            setReassignTarget(null);
            setNewAssignee('');
            // Refresh tasks
            const tasksResponse = await axios.get('http://localhost:5000/api/tasks', {
                headers: { role: 'employee', userid: employeeId }
            });
            setAllTasks(tasksResponse.data);
            setFilteredTasks(tasksResponse.data); // Reset filter or apply current? Simple reset for now.
        } catch (error) {
            console.error("Reassign error:", error);
            alert(error.response?.data?.message || "Failed to reassign task");
        }
    }

    return (
        <div className='min-h-screen w-full bg-[#0a0a0a] relative overflow-hidden'>
            <div className='absolute w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] -top-20 -left-20 animate-pulse'></div>
            <div className='absolute w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] -bottom-20 -right-20 animate-pulse' style={{ animationDelay: '1s' }}></div>

            <div className='relative z-10 p-6 md:p-10 lg:px-12 lg:py-8 max-w-7xl mx-auto'>
                {/* Header */}
                <div className='bg-white/5 backdrop-blur-md border border-white/10 p-6 lg:p-5 rounded-2xl mb-6 lg:mb-4'>
                    <button
                        onClick={() => navigate('/')}
                        className='text-emerald-400 hover:text-emerald-300 mb-4 lg:mb-2 flex items-center gap-2 transition-all'
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className='text-3xl lg:text-2xl font-bold text-white'>
                        {employee?.firstName}'s Tasks
                    </h1>
                    <p className='text-gray-400 mt-2 lg:mt-1'>View and manage all assigned tasks</p>
                </div>

                {/* Filter Buttons */}
                <div className='grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6 lg:mb-4'>
                    <button
                        onClick={() => filterTasks('all')}
                        className={`relative group overflow-hidden backdrop-blur-xl border p-6 lg:p-5 rounded-2xl transition-all ${activeFilter === 'all'
                            ? 'bg-white/15 border-white/30'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <h2 className='text-3xl lg:text-2xl font-bold text-white mb-1'>{allTasks.length}</h2>
                        <h3 className='text-gray-400 text-sm font-semibold'>All Tasks</h3>
                    </button>

                    <button
                        onClick={() => filterTasks('new')}
                        className={`relative group overflow-hidden backdrop-blur-xl border p-6 lg:p-5 rounded-2xl transition-all ${activeFilter === 'new'
                            ? 'bg-blue-500/20 border-blue-500/40'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <div className='absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2'></div>
                        <h2 className='text-3xl lg:text-2xl font-bold text-white mb-1'>{getStatusCount('new')}</h2>
                        <h3 className='text-gray-400 text-sm font-semibold'>New Tasks</h3>
                    </button>

                    <button
                        onClick={() => filterTasks('active')}
                        className={`relative group overflow-hidden backdrop-blur-xl border p-6 lg:p-5 rounded-2xl transition-all ${activeFilter === 'active'
                            ? 'bg-emerald-500/20 border-emerald-500/40'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <div className='absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2'></div>
                        <h2 className='text-3xl lg:text-2xl font-bold text-white mb-1'>{getStatusCount('active')}</h2>
                        <h3 className='text-gray-400 text-sm font-semibold'>Active Tasks</h3>
                    </button>

                    <button
                        onClick={() => filterTasks('completed')}
                        className={`relative group overflow-hidden backdrop-blur-xl border p-6 lg:p-5 rounded-2xl transition-all ${activeFilter === 'completed'
                            ? 'bg-green-500/20 border-green-500/40'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <div className='absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2'></div>
                        <h2 className='text-3xl lg:text-2xl font-bold text-white mb-1'>{getStatusCount('completed')}</h2>
                        <h3 className='text-gray-400 text-sm font-semibold'>Completed</h3>
                    </button>

                    <button
                        onClick={() => filterTasks('failed')}
                        className={`relative group overflow-hidden backdrop-blur-xl border p-6 lg:p-5 rounded-2xl transition-all ${activeFilter === 'failed'
                            ? 'bg-red-500/20 border-red-500/40'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <div className='absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2'></div>
                        <h2 className='text-3xl lg:text-2xl font-bold text-white mb-1'>{getStatusCount('failed')}</h2>
                        <h3 className='text-gray-400 text-sm font-semibold'>Failed</h3>
                    </button>
                </div>

                {/* Task List */}
                <TaskList data={{ tasks: filteredTasks }} onReassignRequest={(task) => setReassignTarget(task)} />

                {/* Reassign Modal */}
                {reassignTarget && (
                    <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm'>
                        <div className='bg-[#1c1c1c] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl'>
                            <h2 className='text-2xl font-bold text-white mb-4'>Reassign Task</h2>
                            <p className='text-gray-400 mb-6'>
                                Reassigning <strong>"{reassignTarget.title}"</strong> ({reassignTarget.category}).
                                <br />Original Assignee: {employee?.firstName}
                            </p>

                            <div className='mb-6'>
                                <label className='block text-sm text-gray-400 mb-2'>Select New Employee ({reassignTarget.category})</label>
                                <select
                                    value={newAssignee}
                                    onChange={(e) => setNewAssignee(e.target.value)}
                                    className='w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-emerald-500'
                                >
                                    <option value="" className='bg-[#1c1c1c] text-gray-500'>Select Employee</option>
                                    {allEmployees
                                        .filter(emp => emp.designation === reassignTarget.category && emp._id !== employeeId)
                                        .map(emp => (
                                            <option key={emp._id} value={emp._id} className='bg-[#1c1c1c]'>
                                                {emp.firstName}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className='flex justify-end gap-3'>
                                <button
                                    onClick={() => {
                                        setReassignTarget(null);
                                        setNewAssignee('');
                                    }}
                                    className='px-4 py-2 text-white hover:bg-white/5 rounded-xl transition-all'
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReassignSubmit}
                                    className='px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all'
                                >
                                    Confirm Reassign
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EmployeeTasksView
