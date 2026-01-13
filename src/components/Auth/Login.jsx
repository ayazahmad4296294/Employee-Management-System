import React, { useState } from 'react'

const Login = ({ handleLogin }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const submitHandler = (e) => {
        e.preventDefault();

        handleLogin(email, password)

        setEmail("")
        setPassword("")

    }

    return (
        <div className='flex h-screen w-screen items-center justify-center bg-[#0a0a0a] relative overflow-hidden'>
            {/* Background decorative elements */}
            <div className='absolute w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] -top-20 -left-20 animate-pulse'></div>
            <div className='absolute w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -bottom-20 -right-20 animate-pulse' style={{ animationDelay: '1s' }}></div>

            <div className='relative z-10 w-full max-w-lg mx-4 md:mx-5'>
                <div className='bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-16 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl'>
                    <div className='text-center mb-8 md:mb-10'>
                        <h1 className='text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight'>Welcome Back</h1>
                        <p className='text-gray-400 text-base md:text-lg'>Sign in to manage your tasks</p>
                    </div>

                    <form
                        onSubmit={(e) => {
                            submitHandler(e);
                        }}
                        className='space-y-5 md:space-y-6'>

                        <div className='relative group'>
                            <input
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                                required
                                type="email"
                                placeholder='Email Address'
                                className='w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-base md:text-lg transition-all placeholder:text-gray-600'
                            />
                        </div>

                        <div className='relative group'>
                            <input
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                                required
                                type="password"
                                placeholder='Password'
                                className='w-full text-white outline-none bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-base md:text-lg transition-all placeholder:text-gray-600'
                            />
                        </div>

                        <button className='w-full group relative flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 md:py-4 px-6 rounded-xl md:rounded-2xl text-lg md:text-xl transition-all duration-300 shadow-lg shadow-emerald-900/20 active:scale-[0.98] overflow-hidden'>
                            <span className='relative z-10'>Login</span>
                            <div className='absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700'></div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
