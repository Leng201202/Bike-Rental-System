import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { showToast } from '../../components/UI/toast';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        studentId: '',
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
            useAuthStore.getState().login({
                identifier: formData.studentId,
                password: formData.password,
                fullName: formData.fullName,
                studentId: formData.studentId,
                phoneNumber: formData.phoneNumber,
            });
            showToast.success("Account created successfully!");
            navigate('/permissions');
        } else {
            showToast.error(error || "Registration failed.");
        }
    };

    return (
        <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-12 bg-[#F7F7F7]">

            <div className="w-full max-w-lg relative z-10">
                <div className="bg-white p-10 rounded-lg border border-[#E5E5E5] shadow-sm">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-semibold text-[#8B2E2E]">User Registration</h2>
                        <p className="text-[#6B7280] mt-2 font-medium">Create your campus account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" required />
                            <Input label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="64XXXXXXXX" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@university.edu" required />
                            <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+66 XX-XXX-XXXX" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                            <Input label="Confirm" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
                        </div>

                        <Button type="submit" loading={loading} className="w-full mt-4 py-3 text-base">
                            Register Account
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-[#6B7280] font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#8B2E2E] hover:text-[#6F2323] font-semibold transition-colors border-b border-[#D9A5A5] hover:border-[#8B2E2E]">
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