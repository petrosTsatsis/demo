import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { FaCheck, FaDatabase, FaPhone, FaUsers } from "react-icons/fa";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { ImBin } from "react-icons/im";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdCancel, MdModeEdit } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import UserService from "../services/user-service";
import EditProfileModal from "./profile-components/edit-profile-modal";

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPageUser, setCurrentPageUser] = React.useState(1);
  const [rowsPerPageUser, setRowsPerPageUser] = React.useState(5);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [clickedUser, setClickedUser] = useState(null);
  const [latestUser, setLatestUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // call the method that fetches the users
    fetchUsers();
  }, []);

  useEffect(() => {
    // find the user with the biggest id and set him/her as the last added user
    if (users.length > 0) {
      const maxIdUser = users.reduce((prev, current) =>
        prev.id > current.id ? prev : current
      );
      setLatestUser(maxIdUser);
    }
  }, [users]);

  // fetch all the users
  const fetchUsers = async () => {
    try {
      const response = await UserService.getAllUsers();
      const allUsers = response.data;

      // Fetch the current logged-in user
      const currentUserResponse = await UserService.getCurrentUser();
      const currentUser = currentUserResponse.data;

      // Filter out the current user from the list of users
      const filteredUsers = allUsers.filter(
        (user) => user.id !== currentUser.id
      );

      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // function to open the edit modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // function to close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  // handle the collapse component
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // when a checkbox is checked open the popover with the options for the specific user and close it when we remove the check
  const handleCheckboxChange = (userId) => {
    if (selectedUserId === userId) {
      console.log("Unselecting user:", userId);
      setSelectedUserId(null);
      setPopoverOpen(false);
    } else {
      setSelectedUserId(userId);
      setPopoverOpen(true);
      const clickedUser = users.find((user) => user.id === userId);
      setClickedUser(clickedUser);
    }
  };

  // close the popover and remove the check from the checkbox
  const handlePopoverClose = () => {
    setPopoverOpen(false);
    setClickedUser(null);
    setSelectedUserId(null);
  };

  // method that is updating the users array with the new edit array after a user's edit
  const handleProfileUpdate = (updatedUser) => {
    // find the user
    const updatedIndex = users.findIndex((user) => user.id === updatedUser.id);

    if (updatedIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[updatedIndex] = updatedUser;

      setUsers(updatedUsers);
    }
  };

  // view the user's details
  const handleViewUserDetails = () => {
    if (latestUser) {
      window.location.href = `/Users/${latestUser.id}`;
    }
  };

  // view the selected user's details
  const handleViewSelectedUserDetails = () => {
    if (selectedUserId) {
      window.location.href = `/Users/${selectedUserId}`;
    }
  };

  // show the delete user confirmation modal
  const deleteUser = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  // user delete confirmation method
  const confirmDelete = () => {
    UserService.deleteUser(userToDelete)
      .then(() => {
        fetchUsers();
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // method that sorts the users by their first name
  const sortByFirstName = () => {
    const sortedUsers = [...users].sort((a, b) =>
      a.fname.localeCompare(b.fname)
    );
    setUsers(sortedUsers);
  };

  // method that sorts the users by their first name
  const sortByLastName = () => {
    const sortedUsers = [...users].sort((a, b) =>
      a.lname.localeCompare(b.lname)
    );
    setUsers(sortedUsers);
  };

  // default sorting
  const sortByUserId = () => {
    const sortedUsers = [...users].sort((a, b) => a.id - b.id);
    setUsers(sortedUsers);
  };

  // function to handle the pages
  const handlePageChangeUser = (newPage) => {
    setCurrentPageUser((prevPage) => {
      const totalPages = Math.ceil(users.length / rowsPerPageUser);
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  // function to handle the rows per page
  const handleRowsPerPageChangeUser = (event) => {
    setRowsPerPageUser(parseInt(event.target.value));
    setCurrentPageUser(1);
  };

  const indexOfLastRowUser = currentPageUser * rowsPerPageUser;
  const indexOfFirstRowUser = indexOfLastRowUser - rowsPerPageUser;
  const currentRowsUser = users.slice(indexOfFirstRowUser, indexOfLastRowUser);
  return (
    // container that contains : add user button, popover for user, users table, latest user added
    <div className="container-fluid">
      <div className="row" style={{ marginTop: "60px" }}>
        <div
          className="col-md-2 d-flex justify-content-center"
          style={{ marginTop: "83px" }}
        >
          {/* add user button  */}
          <div>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "220px",
                  backgroundColor: "rgb(76, 101, 151) ",
                  padding: "10px",
                  borderRadius: "15px",
                  boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.5)",
                  color: "white",
                  border: "none",
                  marginBottom: "33px",
                  cursor: "pointer",
                }}
              >
                Add User{" "}
                <IoIosAddCircleOutline
                  style={{ fontSize: "20px", marginBottom: "2px" }}
                />{" "}
              </button>
            </Link>

            {/* popover for each user */}
            {popoverOpen && clickedUser && (
              <div
                className="popover"
                style={{
                  width: "220px",
                  backgroundColor: "#313949",
                  padding: "10px",
                  borderRadius: "15px",
                  boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.5)",
                  color: "white",
                  height: "300px",
                }}
              >
                {/* popover's content  */}
                <button
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "#aaa",
                  }}
                  onClick={handlePopoverClose}
                >
                  X
                </button>

                <div
                  className="popover-content"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <h6 style={{ marginBottom: "35px" }}>
                    <Avatar
                      name={`${clickedUser.fname} ${clickedUser.lname}`}
                      size="25"
                      round={true}
                      className="avatar"
                      style={{ marginRight: "5px" }}
                    />{" "}
                    {clickedUser.fname} {clickedUser.lname}
                  </h6>

                  {/* view details popover button */}
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    style={{ marginBottom: "25px" }}
                    onClick={handleViewSelectedUserDetails}
                  >
                    View Details
                    <TbListDetails
                      style={{
                        marginLeft: "4px",
                        marginBottom: "3px",
                        fontSize: "18px",
                      }}
                    />
                  </button>

                  {/* edit user popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    style={{ marginBottom: "25px" }}
                    onClick={handleEditClick}
                  >
                    Edit
                    <MdModeEdit
                      style={{
                        marginLeft: "6px",
                        marginBottom: "5px",
                        fontSize: "18px",
                      }}
                    />
                  </button>

                  {/* render the EditUserModal when we click the edit button*/}
                  <EditProfileModal
                    isOpen={showEditModal}
                    onRequestClose={handleCloseModal}
                    currentUser={clickedUser}
                    onProfileUpdate={handleProfileUpdate}
                  />
                  {/* delete user popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    style={{ marginBottom: "15px" }}
                    onClick={() => deleteUser(selectedUserId)}
                  >
                    Delete
                    <ImBin
                      style={{
                        marginLeft: "6px",
                        marginBottom: "5px",
                        fontSize: "18px",
                      }}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* users table field */}
        <div className="col-md-8">
          <div className="components-table">
            <h3
              style={{
                boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                color: "black",
                textAlign: "center",
                marginBottom: "40px",
                backgroundColor: "#313949",
                color: "white",
                borderRadius: "50px",
                height: "40px",
              }}
            >
              <FaUsers style={{ marginRight: "10px", marginBottom: "3px" }} />
              Users
            </h3>
            <table
              className="components table table-striped table-hover"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ width: "10%" }} scope="col">
                    Select
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    First Name
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Last Name
                  </th>
                  <th style={{ width: "30%" }} scope="col">
                    Email
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  currentRowsUser.map((user, index) => (
                    <tr key={index}>
                      <td style={{ width: "10%" }}>
                        <div
                          className="form-check"
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedUserId === user.id}
                            onChange={() => handleCheckboxChange(user.id)}
                          />
                        </div>
                      </td>
                      <td style={{ width: "20%" }}>
                        <Avatar
                          name={`${user.fname} ${user.lname}`}
                          size="25"
                          round={true}
                          className="avatar"
                          style={{ marginRight: "5px" }}
                        />
                        {user.fname}
                      </td>
                      <td style={{ width: "20%" }}>{user.lname}</td>
                      <td
                        style={{
                          width: "30%",
                          fontWeight: "bold",
                        }}
                      >
                        {user.email}
                      </td>
                      <td style={{ width: "20%" }}>
                        <FaPhone
                          style={{ marginRight: "3px", fontSize: "15px" }}
                        />{" "}
                        {user.phoneNumber}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      <div style={{ marginTop: "50px" }}>
                        <FaDatabase
                          style={{ fontSize: "50px", color: "white" }}
                        />
                        <p style={{ color: "white", marginTop: "10px" }}>
                          No Users yet
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="table-task-management">
                  <td colSpan="4">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "40px",
                        }}
                      >
                        <button
                          className="carousel-button"
                          disabled={currentPageUser === 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeUser(currentPageUser - 1);
                          }}
                        >
                          <GrFormPrevious
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={indexOfLastRowUser >= users.length}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeUser(currentPageUser + 1);
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <span style={{ marginLeft: "10px", color: "white" }}>
                          Page {currentPageUser}
                        </span>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ marginLeft: "10px", color: "white" }}>
                          Rows per page:
                        </span>
                        <select
                          className="form-select custom-select"
                          style={{
                            width: "70px",
                            marginLeft: "10px",
                          }}
                          aria-label="Default select example"
                          value={rowsPerPageUser}
                          onChange={handleRowsPerPageChangeUser}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={15}>15</option>
                        </select>
                      </div>

                      <div
                        style={{
                          textAlign: "right",
                          display: "flex",
                          alignItems: "center",
                          paddingRight: 40,
                        }}
                      >
                        <select
                          className="form-select custom-select"
                          onChange={(e) => {
                            const selectedOption = e.target.value;
                            if (selectedOption === "id") {
                              sortByUserId();
                            } else if (selectedOption === "fname") {
                              sortByFirstName();
                            } else if (selectedOption === "lname") {
                              sortByLastName();
                            }
                          }}
                        >
                          <option value="id">Select Sort By</option>
                          <option value="fname">Sort by First Name</option>
                          <option value="lname">Sort by Last Name</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        {/* collapse field with the latest user */}
        <div
          className="col-md-2 d-flex justify-content-center"
          style={{ marginTop: "83px" }}
        >
          <div
            className="accordion"
            id="accordionExample"
            style={{ width: "220px" }}
          >
            <div className="accordion-item">
              {/* collapse content  */}
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseUser"
                  aria-expanded={isCollapsed ? "true" : "false"}
                  aria-controls="collapseUser"
                  onClick={toggleCollapse}
                  style={{ width: "220px" }}
                  color="white"
                >
                  Latest Addition
                </button>
              </h2>
              <div
                id="collapseUser"
                className={`accordion-collapse collapse ${
                  isCollapsed ? "show" : ""
                }`}
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div
                  className="accordion-body"
                  style={{ width: "220px", minHeight: "323px" }}
                >
                  {/* if we have at least one user show some fields */}
                  {users.length > 0 ? (
                    latestUser && (
                      <div>
                        <p style={{ marginBottom: "25px" }}>
                          <span style={{ fontWeight: "bold" }}>
                            First Name:
                          </span>{" "}
                          {latestUser.fname}
                        </p>
                        <p style={{ marginBottom: "25px" }}>
                          <span style={{ fontWeight: "bold" }}>Last Name:</span>{" "}
                          {latestUser.lname}
                        </p>
                        <p style={{ marginBottom: "25px" }}>
                          <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
                          <br /> {latestUser.email}
                        </p>
                        <p style={{ marginBottom: "25px" }}>
                          <span style={{ fontWeight: "bold" }}>Role:</span>{" "}
                          {latestUser.roles.map((role, index) => (
                            <React.Fragment key={role.id}>
                              {index > 0 && ", "}
                              {role.name}
                            </React.Fragment>
                          ))}
                        </p>

                        {/* button to view the user's details */}
                        <button
                          type="button"
                          className="btn btn-outline-warning"
                          style={{ marginTop: "10px" }}
                          onClick={handleViewUserDetails}
                        >
                          View Details{" "}
                          <TbListDetails
                            style={{
                              marginLeft: "4px",
                              marginBottom: "3px",
                              fontSize: "18px",
                            }}
                          />{" "}
                        </button>
                      </div>
                    )
                  ) : (
                    <div style={{ marginTop: "50px", textAlign: "center" }}>
                      <FaDatabase
                        style={{ fontSize: "50px", color: "white" }}
                      />
                      <p style={{ color: "white", marginTop: "10px" }}>
                        No Users yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal that shows up for delete confirmation */}
      {userToDelete && (
        <Modal
          className="delete-modal-style"
          isOpen={showDeleteModal}
          onRequestClose={closeDeleteModal}
          contentLabel="Delete Confirmation"
          style={{
            content: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "400px",
              marginTop: "10%",
              height: "200px",
            },
            overlay: {
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgb(49, 57, 73, 0.9)",
            },
          }}
        >
          <h2>Delete User Confirmation</h2>
          <p>Are you sure you want to delete this user ?</p>
          <div>
            <button className="btn btn-outline-success" onClick={confirmDelete}>
              <FaCheck style={{ marginRight: "5px" }} /> Yes
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={closeDeleteModal}
              style={{ marginLeft: "10px" }}
            >
              <MdCancel style={{ marginRight: "5px" }} />
              No
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListUsers;
