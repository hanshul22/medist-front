import React, { useState, useEffect } from 'react';
import { Header, Sidebar } from '../index';
import ContactServices from '../../services/ContactServices';
import useAsync from '../../hooks/useAsync';
import ReactQuill from 'react-quill';

const Terms = () => {
  const { data, error, isLoading } = useAsync(ContactServices.getTermCondition);
  console.log(data)

  const [formValues, setFormValues] = useState({
    termsAndCondition: '',
    termsAndConditionTitle: '',
    data: 'termsAndCondition',
  });

  useEffect(() => {
    if (data) {
      setFormValues({
        termsAndConditionTitle: data?.data?.Title || '',
        termsAndCondition: data?.data?.English || '',
        data: 'termsAndCondition',
      });
    }
  }, [data]);

  const handleInputChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ContactServices.updateAppPolicy(formValues);
      alert('Terms And Condition updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update Terms And Condition. Please try again.');
    }
  };



  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Terms And Condition</h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto"
          >
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formValues.termsAndConditionTitle}
                onChange={(e) => handleInputChange('termsAndConditionTitle', e.target.value)}
                placeholder="Enter Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-300 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
              <ReactQuill
                theme="snow"
                value={formValues.termsAndCondition}
                onChange={(value) => handleInputChange('termsAndCondition', value)}
                className="bg-white"
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Terms;
