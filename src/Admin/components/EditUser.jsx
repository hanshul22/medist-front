import React, { useState, useEffect } from 'react';

import UserServices from '../../services/UserService';

function UpdateUser({ user, closeModal, onSuccess }) {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    mobileNo: "",
    city: "",
    state: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = useState('img/placeholder-img.png');

  useEffect(() => {
    if (user) {
      setFormValues({
        name: user?.name || '',
        mobileNo: user?.mobileNo || '',
        image: user?.image || '',
        email: user?.email || '',
        state: user?.state || '',
        city: user?.city || '',

      });
      if (user.image) {
        setPreviewImage(process.env.REACT_APP_URL + user.image);
      }
    }
  }, [user]);

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
        image: file,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      for (const key in formValues) {
        if (key !== 'image' || formValues[key] instanceof File) {
          formData.append(key, formValues[key]);
        }
      }

      await UserServices.updateUser(user.id, formData);
      alert('User updated successfully');
      onSuccess();
      closeModal();
    } catch (error) {
      console.error('Failed to update User', error);
      alert('Failed to update User');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Edit User Details</h2>
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
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formValues.name}
                onChange={handleInputChange}
                placeholder="New name"
                required
              />
            </div>

            {/* Mobile No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mobileNo"
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2"
                value={formValues.mobileNo}
                readOnly
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="email"
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2"
                value={formValues.email}
                readOnly
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formValues.city}
                onChange={handleInputChange}
                placeholder="New city"
                required
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formValues.state}
                onChange={handleInputChange}
                placeholder="New state"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="image"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Drop an image or paste URL (up to 1500x1500px). Supported: png, jpeg, jpg, webp.
              </p>
              {previewImage && (
                <div className="mt-4 text-center">
                  <img src={previewImage} alt="Preview" className="mx-auto max-h-40 rounded-lg shadow" />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>


  );
}

export default UpdateUser;
