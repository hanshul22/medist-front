import React, { useState, useEffect } from 'react';
import BannerService from '../../services/BannerService';

const EditBannerModal = ({ banner, onClose, onSubmit }) => {
  const [formValues, setFormValues] = useState({
    title: '',
    image: '',
    link: '',
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (banner) {
      setFormValues({
        title: banner.title || '',
        status: banner.status || '',
        image: banner.image || '',
        link: banner.link || '',
      });
      if (banner.image) {
        setPreviewImage(`http://localhost:3002/${banner.image}`);
      }
    }
  }, [banner]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);

      setFormValues((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.title.trim()) {
      newErrors.title = 'title is required';
    }




    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const data = new FormData();
      data.append('title', formValues.title);
      data.append('status', formValues.status);
      data.append('link', formValues.link);
      if (formValues.image) {
        data.append('image', formValues.image);
      }

      await BannerService.updateBanner(banner.id, data);
      alert('Banner Update Successfully');
      onClose();
    } catch (error) {
      console.error('Failed to Update Banner', error);
      alert('Failed to Update Banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Banner</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Title
            </label>
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>



          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
            <input
              type="file"
              name="image"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              className="form-control"
            />
            <p className="text-sm text-gray-500 mt-1">Supported formats: png, jpeg, jpg, webp</p>
            {previewImage && (
              <div className="file-preview mt-2 text-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ height: '100px', width: '100px', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link URL (optional)
            </label>
            <input
              type="url"
              name="link"
              value={formValues.link}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formValues.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">-- Select Status --</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {/* {errors.status && <p className="mt-2 text-sm text-red-500">{errors.status}</p>} */}
          </div>




          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? 'updating...' : 'Update Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBannerModal; 