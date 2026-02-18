import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { showToast } from '../../components/UI/PremiumToast';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'RIDER'
    });
    const { register, loading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            showToast.error("Passwords don't match!");
            return;
        }

        const success = await register(formData);
        if (success) {
            useAuthStore.getState().login({ username: formData.username, password: formData.password });
            showToast.success("Account created successfully!");
            navigate('/permissions');
        } else {
            showToast.error(error || "Registration failed.");
        }
    };

    return (
        <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse"></div>

            <div className="w-full max-w-lg relative z-10">
                <div className="bg-gray-800/40 backdrop-blur-2xl p-10 rounded-3xl border border-gray-700/50 shadow-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            Join the Ride
                        </h2>
                        <p className="text-gray-400 mt-3 font-medium">Create your campus account in seconds</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" required />
                            <Input label="Username" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe123" required />
                        </div>

                        <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@university.edu" required />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                            <Input label="Confirm" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
                        </div>

                        <Button type="submit" loading={loading} className="w-full mt-4 py-4 text-lg">
                            Get Started
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-400 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-all border-b border-blue-400/30 hover:border-blue-300">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;