import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { Card, CardBody, Col, ListGroup, Row } from "react-bootstrap";
import { FaCheck, FaPhone } from "react-icons/fa";
import { ImBin, ImProfile } from "react-icons/im";
import { MdCancel, MdEmail, MdModeEdit } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import Modal from "react-modal";
import { useParams } from "react-router-dom";
import UserService from "../../services/user-service";
import EditProfileModal from "./edit-profile-modal";

const UserDetails = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [roles, setRoles] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, [id]);

  // fetch all the users
  const fetchUsers = async () => {
    try {
      const response = await UserService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // fetch current user
  const fetchCurrentUser = async () => {
    try {
      const response = await UserService.getUserById(id);

      console.log("Response:", response);

      setCurrentUser(response.data);
      setEmail(response.data.email);
      setFname(response.data.fname);
      setLname(response.data.lname);
      setUsername(response.data.username);
      setDescription(response.data.description);
      setPhoneNumber(response.data.phoneNumber);
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // function to open the edit modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // function to close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    fetchCurrentUser();
  };

  // method that is updating the users array with the new edit array after a user's edit
  const handleProfileUpdate = (updatedUser) => {
    // Update the user state with the edited data
    setCurrentUser(updatedUser);

    // Find the index of the updated user in the users array
    const updatedIndex = users.findIndex((user) => user.id === updatedUser.id);

    if (updatedIndex !== -1) {
      const updatedUsers = [...users];
      updatedUser[updatedIndex] = updatedUser;

      // Update the users state with the updated array
      setUsers(updatedUsers);
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
        window.history.back();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="container-fluid">
      <h3
        className="container-lg"
        style={{
          marginTop: "50px",
          boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
          color: "black",
          textAlign: "center",
          backgroundColor: "#313949",
          color: "white",
          borderRadius: "50px",
          height: "40px",
        }}
      >
        <ImProfile style={{ marginRight: "10px", marginBottom: "3px" }} />
        User Profile Details
      </h3>
      <div
        className="container-md"
        style={{
          boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
          backgroundColor: "#313949",
          marginTop: "30px",
          borderRadius: "10px",
          textAlign: "center",
          paddingTop: "1px",
          position: "relative",
        }}
      >
        {/* Avatar field*/}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            marginRight: "20px",
            textAlign: "left",
            marginTop: "20px",
            marginLeft: "40px",
          }}
        >
          <Avatar
            name={`${fname} ${lname}`}
            size="100"
            round={true}
            className="avatar"
            style={{
              marginRight: "5px",
              boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
            }}
          />
        </div>

        {/* Edit and Delete Buttons */}
        <div style={{ position: "absolute", top: "150px", marginLeft: "8px" }}>
          <button
            type="button"
            className="btn btn-outline-success"
            style={{ marginBottom: "10px", marginRight: "10px" }}
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
          {/* render the EditProfileModal when we click the edit button*/}
          <EditProfileModal
            isOpen={showEditModal}
            onRequestClose={handleCloseModal}
            currentUser={currentUser}
            onProfileUpdate={handleProfileUpdate}
          />
        </div>

        <div
          style={{ position: "absolute", top: "150px", marginLeft: "100px" }}
        >
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ marginBottom: "15px" }}
            onClick={() => deleteUser(currentUser.id)}
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

        {/* First Name and Last Name fields */}
        <Row
          className="mt-4"
          style={{
            marginBottom: "30px",
            marginTop: "10px",
          }}
        >
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
            >
              <strong>First Name:</strong> {fname}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
            >
              <strong>Last Name:</strong> {lname}
            </p>{" "}
          </Col>
        </Row>

        {/* Email field */}
        <Row
          className="mt-4"
          style={{
            marginTop: "20px",
            marginBottom: "50px",
          }}
        >
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "400px", margin: "0 auto", padding: "10px" }}
            >
              <strong>
                {" "}
                <MdEmail
                  style={{ paddingBottom: "1px", fontSize: "18px" }}
                />{" "}
                Email:
              </strong>{" "}
              {email}
            </p>
          </Col>
        </Row>

        {/* username, role and phone number fields */}
        <Row
          className="mt-4"
          style={{
            marginBottom: "30px",
            marginTop: "20px",
          }}
        >
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
            >
              <strong>Username:</strong> {username}
            </p>{" "}
          </Col>

          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
            >
              <strong>Role:</strong>{" "}
              <ListGroup>
                {roles.map((role, index) => (
                  <ListGroup.Item
                    key={role.id}
                    style={{ backgroundColor: "transparent" }}
                  >
                    {role.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </p>{" "}
          </Col>

          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
            >
              <strong>
                {" "}
                <FaPhone
                  style={{ paddingBottom: "5px", fontSize: "20px" }}
                />{" "}
                Phone Number:
              </strong>{" "}
              {phoneNumber}
            </p>{" "}
          </Col>
        </Row>
        {/* Description fields */}

        <Row
          className="mt-4"
          style={{
            marginTop: "20px",
            marginBottom: "50px",
          }}
        >
          <Col className="d-flex justify-content-center align-items-center">
            <Card
              style={{
                backgroundColor: "transparent",
                border: "none",
                marginBottom: "30px",
              }}
            >
              <CardBody
                className="customer-detail-fields"
                style={{
                  width: "900px",
                  margin: "0 auto",
                  padding: "10px",
                  height: "150px",

                  backgroundColor: "transparent",
                  marginLeft: "50px",
                }}
              >
                <strong>
                  {" "}
                  <TbFileDescription
                    style={{ paddingBottom: "1px", fontSize: "18px" }}
                  />{" "}
                  Description:
                </strong>{" "}
                {description}
              </CardBody>
            </Card>
          </Col>
        </Row>
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

export default UserDetails;
