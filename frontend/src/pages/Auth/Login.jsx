import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const { login, loading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(credentials);
        if (success) {
            showToast.success("Welcome back!", <span className="text-xl">👋</span>);
            const user = useAuthStore.getState().user;
            user?.role === 'ADMIN' ? navigate('/admin') : navigate('/rider');
        } else {
            showToast.error("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-gray-800/40 backdrop-blur-2xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            Welcome Back
                        </h2>
                        <p className="text-gray-400 mt-3 font-medium">Log in to continue your ride</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full mt-4"
                        >
                            Log In
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-400 font-medium">
                            New here?{' '}
                            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold transition-all border-b border-blue-400/30 hover:border-blue-300">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;