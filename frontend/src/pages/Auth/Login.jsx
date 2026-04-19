import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { showToast } from '../../components/UI/toast';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

function Login() {
    const [credentials, setCredentials] = useState({
        identifier: '',
        password: ''
    });
    const { login, loading } = useAuthStore();
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
        <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-10 bg-[#F7F7F7]">

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white p-8 rounded-lg border border-[#E5E5E5] shadow-sm">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-semibold text-[#8B2E2E]">User Login</h2>
                        <p className="text-[#6B7280] mt-2 font-medium">Log in to access bike rental services</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Student ID"
                            name="identifier"
                            value={credentials.identifier}
                            onChange={handleChange}
                            placeholder="64XXXXXXXX"
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
                        <p className="text-[#6B7280] font-medium">
                            New here?{' '}
                            <Link to="/register" className="text-[#8B2E2E] hover:text-[#6F2323] font-semibold transition-colors border-b border-[#D9A5A5] hover:border-[#8B2E2E]">
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