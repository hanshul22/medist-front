import React, { useState, useEffect } from 'react';
import { Header, Sidebar } from '../index';
import ContactServices from '../../services/ContactServices';
import useAsync from '../../hooks/useAsync';

const ManageContacts = () => {
  const [formValues, setFormValues] = useState({
    phone: '',
    youtube: '',
    email: '',
    whatsApp: '',
    faceBook: 'https://',
    linkedin: 'https://',
    instagram: 'https://',
    twitter: 'https://'
  });

  const { data, error, isLoading } = useAsync(ContactServices.getContactDetail);

  useEffect(() => {
    if (data?.data) {
      setFormValues({
        phone: data.data.phone || '',
        youtube: data.data.youtube || '',
        email: data.data.email || '',
        whatsApp: data.data.whatsApp || '',
        faceBook: data.data.faceBook || 'https://',
        linkedin: data.data.linkedin || 'https://',
        instagram: data.data.instagram || 'https://',
        twitter: data.data.twitter || 'https://'
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ContactServices.updateContactDetail(data.data._id, formValues);
      alert('Contact details updated successfully');
    } catch (error) {
      console.error('Failed to update contact details', error);
      alert('Failed to update contact details');
    }
  };

  if (isLoading) return <div className="p-4 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error loading contact details</div>;

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Us</h2>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  maxLength={10}
                  value={formValues.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-300 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-300 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">WhatsApp</label>
                <input
                  type="text"
                  name="whatsApp"
                  maxLength={10}
                  value={formValues.whatsApp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-300 focus:outline-none"
                />
              </div>
            </div>

            {/* Social Links */}
            {[
              { label: 'Facebook', name: 'faceBook' },
              { label: 'Instagram', name: 'instagram' },
              { label: 'LinkedIn', name: 'linkedin' },
              { label: 'Twitter', name: 'twitter' },
              { label: 'YouTube', name: 'youtube' }
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block mb-1 text-sm font-medium text-gray-700">{label} Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name={name}
                    value={formValues[name]}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="text-gray-500 hover:text-green-500"
                    title="Copy link"
                  >
                    <i className="fa fa-paperclip"></i>
                  </button>
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full md:w-auto mt-4"
            >
              Submit
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ManageContacts;
