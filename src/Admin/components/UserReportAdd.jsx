import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserServices from "../../services/UserService";
// import AddImage from "../../../images/placeholder-img.svg";

function AddReport({ user, closeModal, onSuccess }) {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        report: "",
        user: user._id
    });

    const [previewImage, setPreviewImage] = useState('');

    // Handle form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    // Handle file upload
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);

            setFormValues((prevValues) => ({
                ...prevValues,
                report: file,
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(formValues).forEach((key) => {
                formData.append(key, formValues[key]);
            });

            await UserServices.createUserReport(formData);
            alert("Report Added Successfully");
            onSuccess();
            closeModal();
        } catch (error) {
            console.error("Failed to add report details", error);
            alert("Failed to add report details");
            closeModal();
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
                                onChange={handleFileChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <div className="mt-4 text-center">
                                {previewImage && (
                                    <img
                                        id="uploadFile"
                                        src={previewImage}
                                        alt="Preview"
                                        className="mx-auto max-h-48 rounded-md border shadow"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-right">
                            <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>


    );
}

export default AddReport;
