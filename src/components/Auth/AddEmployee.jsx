import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddEmployee = () => {
    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [designation, setDesignation] = useState("")
    const [designationsList, setDesignationsList] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDesignations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/designations')
                setDesignationsList(response.data)
            } catch (error) {
                console.error("Error fetching designations:", error)
            }
        }
        fetchDesignations()
    }, [])

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log('Form data:', { firstName, email, password });
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register-employee', {
                firstName,
                email,
                password,
                designation
            });
            console.log('Registration response:', response.data);
            alert("Employee added successfully!");
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to add employee");
        }
    }

    return (
        <div className='flex h-screen w-screen items-center justify-center bg-[#0a0a0a] relative overflow-hidden'>
            <div className='absolute w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] -top-20 -left-20 animate-pulse'></div>
            <div className='absolute w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -bottom-20 -right-20 animate-pulse' style={{ animationDelay: '1s' }}></div>

            <div className='relative z-10 w-full max-w-lg mx-5'>
                <div className='bg-white/5 backdrop-blur-xl border border-white/10 p-12 md:p-16 lg:p-10 rounded-[2.5rem] shadow-2xl'>
                    <button
                        onClick={() => navigate('/')}
                        className='text-emerald-400 hover:text-emerald-300 mb-6 lg:mb-4 flex items-center gap-2 transition-all'
                    >
                        ← Back
                    </button>
                    <div className='text-center mb-10 lg:mb-6'>
                        <h1 className='text-4xl md:text-5xl lg:text-4xl font-bold text-white mb-3 tracking-tight'>Add Employee</h1>
                        <p className='text-gray-400 text-lg lg:text-base'>Create a new employee account</p>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-6 lg:space-y-4'>
                        <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            type="text"
                            placeholder='First Name'
                            className='w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-4 px-6 lg:py-2 lg:px-4 text-lg lg:text-sm transition-all placeholder:text-gray-600'
                        />
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            type="email"
                            placeholder='Email Address'
                            className='w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-4 px-6 lg:py-2 lg:px-4 text-lg lg:text-sm transition-all placeholder:text-gray-600'
                        />
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            type="password"
                            placeholder='Password'
                            className='w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-4 px-6 lg:py-2 lg:px-4 text-lg lg:text-sm transition-all placeholder:text-gray-600'
                        />
                        <div className='relative'>
                            <select
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                required
                                className='w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-4 px-6 lg:py-2 lg:px-4 text-lg lg:text-sm transition-all appearance-none cursor-pointer placeholder:text-gray-600'
                            >
                                <option value="" className='bg-[#1c1c1c] text-gray-400'>Select Designation</option>
                                {designationsList.map((des, idx) => (
                                    <option key={idx} value={des} className='bg-[#1c1c1c]'>{des}</option>
                                ))}
                            </select>
                            <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                        <button className='w-full group relative flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 lg:py-2.5 rounded-2xl text-xl lg:text-base transition-all duration-300 shadow-lg shadow-emerald-900/20 active:scale-[0.98] overflow-hidden'>
                            <span className='relative z-10'>Add Employee</span>
                            <div className='absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700'></div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddEmployee
