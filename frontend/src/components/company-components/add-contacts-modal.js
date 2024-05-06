import React, {useEffect, useState} from "react";
import Avatar from "react-avatar";
import {FaCheck} from "react-icons/fa";
import {IoMdContact, IoMdPersonAdd} from "react-icons/io";
import {MdCancel} from "react-icons/md";
import Modal from "react-modal";
import Select from "react-select";
import CompanyService from "../../services/company-service";
import ContactService from "../../services/contact-service";

const AddContactsModal = ({ isOpen, onRequestClose, company }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contactsAddedToCompany, setContactsAddedToCompany] = useState([]);

  useEffect(() => {
    // Fetch contacts
    ContactService.getAllContacts()
      .then((response) => {
        setContacts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
      });

    // Fetch contacts added to the company
    if (company) {
      CompanyService.getContacts(company.id)
        .then((response) => {
          setContactsAddedToCompany(response.data.map((contact) => contact.id));
        })
        .catch((error) => {
          console.error("Error fetching contacts added to the company:", error);
        });
    }
  }, [company]);

  const resetState = () => {
    setSelectedContacts([]);
  };

  // when we add contacts in a company then we check which contacts are associated with the company to avoid displaying them again
  const handleSubmitEditForm = (e) => {
    e.preventDefault();

    const selectedContactObjects = selectedContacts.map((contactId) =>
      contacts.find((contact) => contact.id === contactId)
    );

    CompanyService.addContactToCompany(company.id, selectedContactObjects)
      .then(() => {
        onRequestClose();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding contacts to company:", error);
      });
  };
  const filteredOptions = contacts.filter(
    (contact) => !contactsAddedToCompany.includes(contact.id)
  );

  // Structure of the dropdown for the contacts
  const DropdownList = ({ label, options, selectedOptions, onChange }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "300px",
      }}
    >
      <label htmlFor={`${label}Dropdown`} style={{ marginBottom: "8px" }}>
        {label}
      </label>
      <Select
        id={`${label}Dropdown`}
        options={options.map((option) => ({
          value: option.id,
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                name={`${option.fname} ${option.lname}`}
                size="25"
                round={true}
                className="avatar"
                style={{ marginRight: "5px" }}
              />
              {`${option.fname} ${option.lname}`}
            </div>
          ),
        }))}
        isMulti
        value={
          Array.isArray(selectedOptions)
            ? selectedOptions.map((optionId) => ({
                value: optionId,
                label: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      name={`${
                        options.find((option) => option.id === optionId).fname
                      } ${
                        options.find((option) => option.id === optionId).lname
                      }`}
                      size="25"
                      round={true}
                      className="avatar"
                      style={{ marginRight: "5px" }}
                    />
                    {`${
                      options.find((option) => option.id === optionId).fname
                    } ${
                      options.find((option) => option.id === optionId).lname
                    }`}
                  </div>
                ),
              }))
            : []
        }
        onChange={onChange}
        styles={{
          control: (provided) => ({
            ...provided,
            width: "240px",
            height: "90px",
          }),
          valueContainer: (provided) => ({
            ...provided,
            maxHeight: "80px",
            overflowY: "auto",
            paddingRight: "5px",
          }),
          menu: (provided) => ({
            ...provided,
            maxHeight: "120px",
            overflowY: "auto",
          }),
          menuList: (provided) => ({
            ...provided,
            maxHeight: "120px",
            overflowY: "auto",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#546A7B" : "#313949",
            color: "white",
            borderRadius: "50px",
            marginBottom: "5px",
            marginLeft: "5px",
            marginRight: "5px",
            width: "200px",
            "&:hover": {
              backgroundColor: "#546A7B",
              cursor: "pointer",
            },
            "&:active": {
              backgroundColor: "#546A7B",
            },
          }),
        }}
      />
    </div>
  );

  return (
    // modal with the add contacts form
    <Modal
      className="modal-style"
      isOpen={isOpen}
      onRequestClose={() => {
        onRequestClose();
        resetState();
      }}
      contentLabel="Edit Modal"
      style={{
        content: {
          outline: "none",
        },
        overlay: {
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgb(219, 213, 201, 0.6)",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "85vh",
        }}
      >
        <div className="add-contact container">
          {/* add contacts form */}
          <form className="add-contact-form" onSubmit={handleSubmitEditForm}>
            <h4
              style={{
                boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                textAlign: "center",
                marginBottom: "10px",
                backgroundColor: "#313949",
                color: "#7caa56",
                borderRadius: "50px",
                height: "35px",
                marginTop: "15px",
              }}
            >
              {" "}
              <IoMdPersonAdd style={{ marginBottom: "4px" }} /> Add Contacts
            </h4>
            <DropdownList
              label={
                <div
                  style={{
                    marginTop: "20px",
                    marginBottom: "10px",
                    color: "white",
                  }}
                >
                  <IoMdContact
                    style={{
                      marginLeft: "10px",
                      marginBottom: "3px",
                      fontSize: "20px",
                      marginRight: "3px",
                    }}
                  />
                  {""}
                  Select Contacts
                </div>
              }
              style={{ marginTop: "30px" }}
              options={filteredOptions}
              selectedOptions={selectedContacts}
              onChange={(selectedOptions) =>
                setSelectedContacts(
                  selectedOptions.map((option) => option.value)
                )
              }
            />
            {/* Submit and Cancel buttons field */}
            <div
              style={{
                marginTop: "25px",
                marginBottom: "15px",
                marginLeft: "55px",
              }}
            >
              <button
                type="submit"
                className="btn btn-outline-success mr-2"
                style={{ marginRight: "10px" }}
              >
                Save{" "}
                <FaCheck
                  style={{
                    marginLeft: "4px",
                    fontSize: "15px",
                    marginBottom: "3px",
                  }}
                />{" "}
              </button>
              <button
                type="button"
                onClick={() => {
                  onRequestClose();
                  resetState();
                }}
                className="btn btn-outline-danger"
              >
                Cancel{" "}
                <MdCancel
                  style={{
                    marginLeft: "4px",
                    fontSize: "15px",
                    marginBottom: "3px",
                  }}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddContactsModal;
