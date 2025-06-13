import React, { useState, useEffect, useRef } from 'react';
import { Header, Sidebar } from '../index';
import AdminServices from '../../services/AdminService';
import useAsync from '../../hooks/useAsync';

const ManageSetting = () => {
    const { data, error, isLoading, run } = useAsync(AdminServices.getMyProfile);
    // console.log(data);

    const [formValues, setFormValues] = useState({
        phone: '',
        name: '',
        email: '',
        // state: '',
        // address: '',
        // city: '',
    });

    const [formValues2, setFormValues2] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    // Update form values when data is fetched
    useEffect(() => {
        if (data) {
            setFormValues({
                phone: data.mobileNo || '',
                name: data.name || '',
                email: data.email || '',
                // state: data.state || '',
                address: data.address || '',
                city: data.city || '',
            });

            if (data.image) {
                setPreviewUrl(data.image); // If profile image URL exists in data
            }
        }
    }, [data]);

    // Handle form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleInputChange2 = (event) => {
        const { name, value } = event.target;
        setFormValues2({
            ...formValues2,
            [name]: value,
        });
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await AdminServices.updateMe(formData); // Assuming updateProfileImage is a method in AdminServices
            alert('Profile image updated successfully');
            console.log(res);
            localStorage.setItem('image', res?.image);
            run();
        } catch (error) {
            console.error('Failed to update profile image', error);
            alert('Failed to update profile image');
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log(formValues);
            const res = await AdminServices.updateMe(formValues);
            console.log(">>>", res)
            localStorage.setItem('userRole', res?.userType);
            localStorage.setItem('name', res?.name);
            window.location.reload();
            alert('Admin details updated successfully');
        } catch (error) {
            console.error('Failed to update Admin details', error);
            alert('Failed to update Admin details');
        }
    };

    const handleSubmit2 = async (event) => {
        event.preventDefault();
        try {
            if (formValues2.newPassword !== formValues2.confirmPassword) {

                alert('New password and confirm password do not match');
            } else if (formValues2.oldPassword === formValues2.newPassword) {
                alert('New password cannot be the same as the old password');
            } else {
                console.log("klfjkl", formValues2)
                await AdminServices.updatePassword(formValues2);
                alert('Password updated successfully');
            }
        } catch (error) {
            console.error('Failed to update password', error);
            alert('Failed to update password ');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading admin details</div>;
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-auto p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>

                    <div className="flex flex-col flex-1 p-6 bg-white rounded-xl shadow-sm">
                        {/* Profile Header */}
                        <div className="flex justify-center mb-8">
                            <div className="relative w-32 h-32">
                                <img
                                    src={ previewUrl}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-4 border-green-500"
                                />
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <button
                                    type="button"
                                    className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <i className="fa fa-pencil" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left: Basic Info */}
                            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                                <h4 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h4>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {['name', 'phone', 'email'].map((field) => (
                                        <div key={field}>
                                            <label className="block text-sm font-medium text-gray-700 capitalize">
                                                {field}
                                            </label>
                                            <input
                                                type={field === 'email' ? 'email' : 'text'}
                                                name={field}
                                                value={formValues[field]}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="submit"
                                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
                                    >
                                        Save
                                    </button>
                                </form>
                            </div>

                            {/* Right: Change Password */}
                            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                                <h4 className="text-lg font-semibold text-gray-700 mb-4">Change your password</h4>
                                <form onSubmit={handleSubmit2} className="space-y-4">
                                    {[
                                        { name: 'oldPassword', label: 'Current Password' },
                                        { name: 'newPassword', label: 'New Password' },
                                        { name: 'confirmPassword', label: 'Confirm Password' }
                                    ].map(({ name, label }) => (
                                        <div key={name}>
                                            <label className="block text-sm font-medium text-gray-700">
                                                {label}
                                            </label>
                                            <input
                                                type="password"
                                                name={name}
                                                value={formValues2[name]}
                                                onChange={handleInputChange2}
                                                placeholder={`Enter ${label.toLowerCase()}`}
                                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="submit"
                                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
                                    >
                                        Save Change
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default ManageSetting;
