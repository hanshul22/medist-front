import React, { useState, useEffect } from 'react';

import UserServices from '../../services/UserService';

function UserReportUpdate({ userReport, closeModal, onSuccess }) {
    const [formValues, setFormValues] = useState({
        report: "",
    });
    const [previewImage, setPreviewImage] = useState('img/placeholder-img.png');

    useEffect(() => {
        if (userReport) {
            setFormValues({

                report: userReport?.report || '',


            });
            if (userReport.report) {
                setPreviewImage(`http://localhost:3002/api/v1` + userReport.report);
            }
        }
    }, [userReport]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
            setFormValues({
                ...formValues,
                report: file,
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            for (const key in formValues) {
                if (key !== 'report' || formValues[key] instanceof File) {
                    formData.append(key, formValues[key]);
                }
            }

            await UserServices.updateUserReport(userReport._id, formData);
            alert('Report updated successfully');
            onSuccess();
            closeModal();
        } catch (error) {
            console.error('Failed to update Report', error);
            alert('Failed to update Report');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-6 rounded-t-3xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Edit Report</h2>
                        <button onClick={closeModal} className="text-white hover:text-emerald-200 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                name="report"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                onChange={handleFileChange}
                                className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Supported formats: png, jpeg, jpg, webp. Max resolution: 1500 x 1500 px.
                            </p>
                            <div className="mt-4 text-center">
                                <img id="uploadFile" src={previewImage} alt="Preview" className="mx-auto max-h-48 rounded-md shadow" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-right">
                            <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                            >
                                Update Report
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>


    );
}

export default UserReportUpdate;
