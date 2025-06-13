import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import UserServices from '../../services/UserService';
import UserReportUpdate from './UserReportUpdate';
import UserReportAdd from './UserReportAdd';

function ViewUser({ user, closeModal }) {
    // Move hooks to the top level
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedAddUser, setSelectedAddUser] = useState(null);
    const [report, setReport] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState(null);
    const [temp, setTemp] = useState(0);

    const handleAddDetails = (book) => {
        setSelectedAddUser(book);
        setIsModalOpen(true);
        toggleActionMenu(null);
    };

    const toggleActionMenu = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    const closeUserModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };
    const handleEditDetails = (help) => {
        setSelectedEdit(help);
        setIsEditModalOpen(true);
        toggleActionMenu(null);
    };

    const handleDelete = (help) => {
        setSelectedEdit(help);
        setIsDeleteModalOpen(true);
        toggleActionMenu(null);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedEdit(null);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedEdit(null);
    };

    function formatDateTime(isoString) {
        const date = new Date(isoString);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();
        return { date: formattedDate, time: formattedTime };
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return 'N/A';
        }

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();

        return `${day}-${month}-${year}`;
    };



    useEffect(() => {
        if (!user) return;
        const fetchReport = async () => {
            try {
                const response = await UserServices.getUserReport(user._id);
                setReport(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching report:', error);
            }
        };
        fetchReport();
    }, [user]);
    const handleDeleteUserReport = async (id) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
          try {
            await UserServices.deleteUserReport(id);
            toast.success('Report deleted successfully');
            fetchReport(); // Refresh the list
          } catch (error) {
            console.error('Error deleting report:', error);
            toast.error('Failed to delete report');
          }
        }
      };
      

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">User Details</h2>
                        <button onClick={closeModal} className="text-white hover:text-emerald-200 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4">
                    <div className="flex flex-col items-center space-y-2">
                        <img
                            src={user?.image ? `http://localhost:3002/${user.image}` : 'img/profile-1.svg'}
                            alt=""
                            className="h-24 w-24 object-contain rounded-full border"
                        />
                        <h3 className="text-lg font-semibold">{user?.name || 'N/A'}</h3>
                    </div>

                    <div className="mt-4 space-y-4">
                        <ul className="flex justify-between text-sm border-b pb-2">
                            <li className="flex flex-col">
                                <span className="font-medium">Email</span>
                                <p>{user?.email || 'N/A'}</p>
                            </li>
                            <li className="flex flex-col">
                                <span className="font-medium">Phone</span>
                                <p>{user?.mobileNo || 'N/A'}</p>
                            </li>
                            <li className="flex flex-col">
                                <span className="font-medium">City</span>
                                <p>{user?.city || 'N/A'}</p>
                            </li>
                        </ul>
                        <ul className="flex justify-between text-sm border-b pb-2">
                            <li className="flex flex-col">
                                <span className="font-medium">Date of Birth</span>
                                <p>{formatDate(user?.dateofbirth) || 'N/A'}</p>
                            </li>
                            <li className="flex flex-col">
                                <span className="font-medium">Reg. Date</span>
                                <p>{formatDate(user?.createdAt) || 'N/A'}</p>
                            </li>
                            <li className="flex flex-col">
                                <span className="font-medium">Login Type</span>
                                <p>{user?.loginType || 'Mobile Number'}</p>
                            </li>
                        </ul>
                    </div>

                    {/* Report History */}
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg font-semibold">Report History</h4>
                            <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 text-sm" onClick={() => handleAddDetails(user)}>
                                <i className="fa fa-add mr-1"></i> Add Report
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-300 text-sm">
                                <thead className="bg-gray-300 text-white">
                                    <tr>
                                        <th className="bg-gray-600 py-2 px-4">Report</th>
                                        <th className="bg-gray-600 py-2 px-4">Edit</th>
                                        <th className="bg-gray-600 py-2 px-4">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report && report.length > 0 ? (
                                        report.map((userReport, index) => (
                                            <tr key={index} className="bg-white border-t">
                                                <td className="px-4 py-2">
                                                    <a href={`http://localhost:3002/${userReport?.report}`} target="_blank" rel="noopener noreferrer">
                                                        <button className="flex items-center text-red-600 hover:underline">
                                                            <i className="fa-solid fa-file-pdf mr-2"></i> User Report
                                                        </button>
                                                    </a>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button className="text-blue-600 hover:underline" onClick={() => handleEditDetails(userReport)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                                <td className="px-4 py-2">
                                                    {/* Uncomment to enable delete */}
                                                    <button
                                                        onClick={() => handleDeleteUserReport(userReport._id)}
                                                        className="text-red-500 hover:text-red-700 transition-colors duration-150 transform hover:scale-110"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4 text-gray-500">No Report Data Available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Modals */}
                    <Modal
                        isOpen={isEditModalOpen}
                        onRequestClose={closeEditModal}
                        contentLabel="Edit Report"
                        className="modal-content"
                        overlayClassName="modal-overlay"
                    >
                        <UserReportUpdate userReport={selectedEdit} closeModal={closeEditModal} onSuccess={() => setTemp(temp + 1)} />
                    </Modal>

                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="Add Report"
                        className="modal-content"
                        overlayClassName="modal-overlay"
                    >
                        <UserReportAdd user={selectedAddUser} closeModal={closeModal} onSuccess={() => setTemp(temp + 1)} />
                    </Modal>
                </div>

                {/* Modal Footer */}
                <div className="p-4 flex justify-end">
                    <button onClick={closeModal} className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">
                        CLOSE
                    </button>
                </div>
            </div>
        </div>



    );
}

export default ViewUser;