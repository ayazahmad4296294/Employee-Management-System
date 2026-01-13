import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthProvider'

const CreateTask = () => {

    const { user: loggedInUser } = useContext(AuthContext)

    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskDate, setTaskDate] = useState('')
    const [assignTo, setAssignTo] = useState('')
    const [category, setCategory] = useState('')
    const [employees, setEmployees] = useState([])
    const [designations, setDesignations] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, desRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/users'),
                    axios.get('http://localhost:5000/api/users/designations')
                ])

                const sortedEmployees = empRes.data.sort((a, b) =>
                    a.firstName.localeCompare(b.firstName)
                )
                setEmployees(sortedEmployees)
                setDesignations(desRes.data)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [])

    const submitHandler = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:5000/api/tasks', {
                title: taskTitle,
                description: taskDescription,
                date: taskDate,
                category,
                assignedTo: assignTo // This is now the employee _id
            });

            if (response.status === 201) {
                setTaskTitle('')
                setCategory('')
                setAssignTo('')
                setTaskDate('')
                setTaskDescription('')
                alert("Task created successfully!")
            }
        } catch (error) {
            console.error("Error creating task:", error);
            alert(error.response?.data?.message || "Failed to create task");
        }
    }


    return (
        <div className='bg-white/5 backdrop-blur-xl border border-white/10 p-5 md:p-10 lg:p-8 mt-6 md:mt-10 lg:mt-6 rounded-2xl md:rounded-3xl shadow-2xl'>
            <form onSubmit={submitHandler} className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-8 items-start w-full'>
                <div className='space-y-6 lg:space-y-4'>
                    <div className='group'>
                        <h3 className='text-gray-400 text-sm lg:text-xs font-semibold mb-2 lg:mb-1 tracking-wide uppercase'>Task Title</h3>
                        <input
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className='w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-3 px-5 lg:py-2 lg:px-4 text-lg lg:text-sm transition-all placeholder:text-gray-600'
                            type="text"
                            placeholder='e.g: Design Landing Page' />
                    </div>
                    <div>
                        <h3 className='text-gray-400 text-sm lg:text-xs font-semibold mb-2 lg:mb-1 tracking-wide uppercase'>Due Date & Time</h3>
                        <input
                            value={taskDate}
                            onChange={(e) => setTaskDate(e.target.value)}
                            className='w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-3 px-5 lg:py-2 lg:px-4 text-lg lg:text-sm transition-all [color-scheme:dark]'
                            type="datetime-local" />
                    </div>
                    <div>
                        <h3 className='text-gray-400 text-sm lg:text-xs font-semibold mb-2 lg:mb-1 tracking-wide uppercase'>Category (Designation)</h3>
                        <div className='relative'>
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setAssignTo(''); // Reset assigned employee when category changes
                                }}
                                className='w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-3 px-5 pr-10 lg:py-2 lg:px-4 text-lg lg:text-sm transition-all appearance-none cursor-pointer'
                            >
                                <option value="" className='bg-[#1c1c1c] text-gray-500'>Select Category</option>
                                {designations.map((des, idx) => (
                                    <option key={idx} value={des} className='bg-[#1c1c1c]'>
                                        {des}
                                    </option>
                                ))}
                            </select>
                            <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className='text-gray-400 text-sm lg:text-xs font-semibold mb-2 lg:mb-1 tracking-wide uppercase'>Assign To</h3>
                        <div className='relative'>
                            <select
                                value={assignTo}
                                onChange={(e) => setAssignTo(e.target.value)}
                                disabled={!category}
                                className={`w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-3 px-5 pr-10 lg:py-2 lg:px-4 text-lg lg:text-sm transition-all appearance-none cursor-pointer ${!category ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <option value="" className='bg-[#1c1c1c]'>
                                    {category ? 'Select Employee' : 'Select Category First'}
                                </option>
                                {employees
                                    .filter(emp => emp.designation === category)
                                    .map((emp) => (
                                        <option key={emp._id} value={emp._id} className='bg-[#1c1c1c]'>
                                            {emp.firstName}
                                        </option>
                                    ))}
                            </select>
                            <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col h-full'>
                    <h3 className='text-gray-400 text-sm lg:text-xs font-semibold mb-2 lg:mb-1 tracking-wide uppercase'>Description</h3>
                    <textarea
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        className='flex-grow w-full min-h-[180px] text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-4 px-6 lg:py-3 lg:px-4 text-lg lg:text-sm transition-all placeholder:text-gray-600 resize-none mb-6 lg:mb-4'
                        placeholder='Describe the task details...'
                        cols="30"
                        rows="8"></textarea>

                    <button className='group relative flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 lg:py-2.5 lg:px-6 rounded-2xl text-xl lg:text-base transition-all duration-300 shadow-lg shadow-emerald-900/20 active:scale-[0.98] overflow-hidden'>
                        <span className='relative z-10'>Create Task</span>
                        <div className='absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700'></div>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateTask
