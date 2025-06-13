import React, { useState, useEffect } from 'react';
import UserServices from '../../services/UserService';
import useAsync from '../../hooks/useAsync';
import Modal from 'react-modal';
import UserUpdate from './EditUser';
import ViewUserReport from './userReport';
import { Link } from 'react-router-dom';


Modal.setAppElement('#root');

function UserManager() {
  const { data, error, isLoading, run } = useAsync(UserServices.getUser);

  const count = data?.data?.length;
  const [activeIndex, setActiveIndex] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedView, setSelectedView] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data?.data || []);

  useEffect(() => {
    if (data?.data) {
      setFilteredData(
        data.data.filter(user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [data, searchTerm]);

  const handleEditDetails = (help) => {
    setSelectedEdit(help);
    setIsEditModalOpen(true);
    toggleActionMenu(null);
  };
  const handleViewDetails = (user) => {
    setSelectedView(user);
    setIsViewModalOpen(true);
    toggleActionMenu(null);
  };
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedView(null);
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

  const toggleActionMenu = (index) => {
    setActiveIndex(index === activeIndex ? null : index); // Toggle the active index
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  function formatDateTime(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }


  function truncateText(text, limit) {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return text;
  }

  return (
    <>
      <div className="right_col" role="main">
        <div className="title-box">
          {/* <h2>User List <span className="badge bg-orange">{count}</span></h2> */}

        </div>


        <div className="container-box px-0">
          {/* <div className="container-box-top-header px-4">
            <div className="container-box-top-header-left-2">
              <input
                type="search"
                name="search"
                placeholder="Search by User Name"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-btn">Search</button>
            </div>
          </div> */}
          <div className="container-box-inner">
            <table id="example" className="table table-striped" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>IMAGE</th>
                  <th>Name</th>
                  <th>Mobile No</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Date</th>
                  <th>Edit</th>
                  <th>View Report</th>

                </tr>
              </thead>
              <tbody>
                {filteredData.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="product-img">
                        <img src={`http://localhost:3002/${user.image}`} alt="" style={{ height: '70px', width: '70px', objectFit: 'contain' }} />
                      </div>
                    </td>
                    <td>{truncateText(user?.name, 15)}</td>
                    <td>{user?.mobileNo}</td>
                    <td>{user?.email}</td>
                    <td>{user?.city}</td>
                    <td>{formatDateTime(user?.createdAt)}</td>
                    <td><button className="text-green-600 hover:text-green-800 mr-4 transition-colors duration-150 transform hover:scale-110" onClick={() => handleEditDetails(user)}> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg></button></td>
                    <td><button className="text-green-600 hover:text-green-800 mr-4 transition-colors duration-150 transform hover:scale-110" onClick={() => handleViewDetails(user)}><svg fill="#000000" height="20px" width="20" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 42 42" enable-background="new 0 0 42 42" xml:space="preserve">
                      <path d="M15.3,20.1c0,3.1,2.6,5.7,5.7,5.7s5.7-2.6,5.7-5.7s-2.6-5.7-5.7-5.7S15.3,17,15.3,20.1z M23.4,32.4
                        C30.1,30.9,40.5,22,40.5,22s-7.7-12-18-13.3c-0.6-0.1-2.6-0.1-3-0.1c-10,1-18,13.7-18,13.7s8.7,8.6,17,9.9
                        C19.4,32.6,22.4,32.6,23.4,32.4z M11.1,20.7c0-5.2,4.4-9.4,9.9-9.4s9.9,4.2,9.9,9.4S26.5,30,21,30S11.1,25.8,11.1,20.7z"/>
                    </svg></button></td>
                    {/* <td><button className="btn btn-danger btn-sm content-icon ms-1" onClick={() => handleDelete(user)}><i className="fa fa-times"></i></button></td> */}


                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          contentLabel="User Details"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <UserUpdate user={selectedEdit} closeModal={closeEditModal} onSuccess={run} />
        </Modal>
        <Modal
          isOpen={isViewModalOpen}
          onRequestClose={closeViewModal}
          contentLabel="User Details"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <ViewUserReport user={selectedView} closeModal={closeViewModal} onSuccess={run} />
        </Modal>
        {/* <Modal
          isOpen={isDeleteModalOpen}
          onRequestClose={closeDeleteModal}
          contentLabel="Delete Confirmation"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <DeleteButton data={selectedEdit} page="User" closeModal={closeDeleteModal} onSuccess={run} />
        </Modal> */}
      </div>
    </>
  );
}

export default UserManager;
