import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {FaCalendarAlt, FaCheck} from "react-icons/fa";
import {CgDanger} from "react-icons/cg";
import {MdCancel, MdDeveloperBoard, MdEuro, MdModeEdit} from "react-icons/md";
import NumberPicker from "react-widgets/NumberPicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {getMonth, getYear} from "date-fns";
import {range} from "lodash";
import Select from "react-select";
import SoftwareService from "../../services/software-service";
import {GrCloudSoftware, GrSystem} from "react-icons/gr";
import {GiFlatPlatform} from "react-icons/gi";
import {GoVersions} from "react-icons/go";
import {TbCategory, TbFileDescription, TbLicense} from "react-icons/tb";
import Modal from "react-modal";
import moment from "moment";

const EditSoftwareModal = ({
  isOpen,
  onRequestClose,
  theSoftware,
  onSoftwareUpdate,
}) => {
  const [description, setDescription] = useState("");
  const [systemRequirements, setSystemRequirements] = useState("");
  const [version, setVersion] = useState("");
  const [name, setName] = useState("");
  const [developer, setDeveloper] = useState("");
  const [price, setPrice] = useState("");
  const [supportedPlatforms, setSupportedPlatforms] = useState([]);
  const platforms = ["Windows", "macOS", "Linux"];
  const [licensingOptions, setLicensingOptions] = useState([]);
  const licensingPeriods = ["1 Month", "3 Months", "6 Months", "1 Year"];
  const [category, setCategory] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genericError, setGenericError] = useState("");
  const years = range(1955, getYear(new Date()) + 10, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (theSoftware) {
      setName(theSoftware.name);
      setDescription(theSoftware.description);
      setVersion(theSoftware.version);
      setPrice(theSoftware.price);
      setCategory(theSoftware.category);
      setSystemRequirements(theSoftware.systemRequirements);
      setSupportedPlatforms(theSoftware.supportedPlatforms);
      const parsedDate = moment(theSoftware.releaseDate, "DD-MM-YYYY").toDate();
      setReleaseDate(parsedDate);
      setLicensingOptions(theSoftware.licensingOptions);
      setDeveloper(theSoftware.developer);
    }
  }, [theSoftware]);

  let existingAlert = document.querySelector(".alert");
  // edit software method
  const handleSubmitEditForm = (e) => {
    e.preventDefault();
    setGenericError("");

    // check if we have any empty fields
    if (
      !name ||
      !releaseDate ||
      !version ||
      !category ||
      !developer ||
      !licensingOptions ||
      !supportedPlatforms
    ) {
      setGenericError("Please fill in all required fields.");
      return;
    }

    // format the date to "dd-mm-yyyy"
    const formattedReleaseDate = moment(releaseDate).format("DD-MM-YYYY");

    SoftwareService.updateSoftware(theSoftware.id, {
      name,
      description,
      version,
      category,
      price,
      systemRequirements,
      licensingOptions,
      supportedPlatforms,
      releaseDate: formattedReleaseDate,
      developer,
    })
      .then(() => {
        onRequestClose();
        fetchUpdatedSoftwareData();

        // Display success alert when we complete the update
        if (!existingAlert) {
          // define the appearance of the alert
          const alertDiv = document.createElement("div");
          alertDiv.className = "alert alert-success";
          alertDiv.setAttribute("role", "alert");
          alertDiv.style.width = "300px";
          alertDiv.style.height = "100px";
          alertDiv.style.position = "fixed";
          alertDiv.style.top = "10px";
          alertDiv.style.left = "50%";
          alertDiv.style.transform = "translateX(-50%)";
          alertDiv.style.zIndex = "9999";
          alertDiv.textContent = "Software details saved successfully.";

          // Close button of the alert
          const closeButton = document.createElement("button");
          closeButton.textContent = "Okay";
          closeButton.className = "btn btn-outline-success btn-sm";
          closeButton.style.width = "80px";
          closeButton.style.borderRadius = "50px";
          closeButton.style.marginTop = "10px";
          closeButton.style.marginLeft = "90px";
          closeButton.onclick = () => {
            alertDiv.remove();
            existingAlert = null;
          };

          alertDiv.appendChild(closeButton);
          document.body.appendChild(alertDiv);
          existingAlert = alertDiv;
        }
      })
      .catch((error) => {
        if (error.response) {
          setGenericError(
            "An error occurred while updating the software. Please try again."
          );
          console.log(error);
        }
      });
  };

  // method to update the software in the list-software component
  const fetchUpdatedSoftwareData = () => {
    SoftwareService.getSoftware(theSoftware.id)
      .then((response) => {
        // update the software in the list-software component
        onSoftwareUpdate(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // method which reset the fields and error status after closing the form
  const resetState = () => {
    setName(theSoftware.name);
    setDescription(theSoftware.description);
    setVersion(theSoftware.version);
    setPrice(theSoftware.price);
    setCategory(theSoftware.category);
    setSystemRequirements(theSoftware.systemRequirements);
    setSupportedPlatforms(theSoftware.supportedPlatforms);
    const parsedDate = moment(theSoftware.releaseDate, "DD-MM-YYYY").toDate();
    setReleaseDate(parsedDate);
    setLicensingOptions(theSoftware.licensingOptions);
    setDeveloper(theSoftware.developer);
    setGenericError("");
  };
  // Dropdown list for the supported platforms field
  const PlatformsDropdownList = ({
    label,
    options,
    selectedOptions,
    onChange,
  }) => (
    <div
      style={{
        height: "50px",
        width: "300px",
      }}
    >
      <Select
        id={`${label}Dropdown`}
        options={options.map((option) => ({
          value: option,
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              {`${option}`}
            </div>
          ),
        }))}
        isMulti
        value={selectedOptions.map((option) => ({
          value: option,
          label: option,
        }))}
        onChange={onChange}
        styles={{
          control: (provided) => ({
            ...provided,
            width: "300px",
            maxHeight: "90px",
            backgroundColor: "#313949",
            borderRadius: "50px",
            minHeight: "50px",
            padding: "4px",
            boxShadow: "none",
            outline: "none",
            boxShadow: "none",
            border: "none",
          }),
          valueContainer: (provided) => ({
            ...provided,
            maxHeight: "90px",
            overflowY: "auto",
            paddingRight: "5px",
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: "white",
            borderRadius: "50px",
            marginRight: "5px",
            marginBottom: "5px",
            color: "black",
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: "#313949",
          }),
          menu: (provided) => ({
            ...provided,
            maxHeight: "200px",
            overflowY: "auto",
            borderRadius: "50px",
            backgroundColor: "#313949",
          }),
          menuList: (provided) => ({
            ...provided,
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "#313949",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            borderRadius: "50px",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "grey" : "white",
            color: "#313949",
            borderRadius: "50px",
            marginBottom: "5px",
            marginLeft: "5px",
            marginRight: "5px",
            width: "200px",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            "&:hover": {
              backgroundColor: "rgb(104, 121, 155)",
              cursor: "pointer",
            },
            "&:active": {
              backgroundColor: "rgb(104, 121, 155)",
            },
          }),
        }}
      />
    </div>
  );
  // Dropdown list for the licensing options field
  const LicensingDropdownList = ({
    label,
    options,
    selectedOptions,
    onChange,
  }) => (
    <div
      style={{
        height: "50px",
        width: "300px",
      }}
    >
      <Select
        id={`${label}Dropdown`}
        options={options.map((option) => ({
          value: option,
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              {`${option}`}
            </div>
          ),
        }))}
        isMulti
        value={selectedOptions.map((option) => ({
          value: option,
          label: option,
        }))}
        onChange={onChange}
        styles={{
          control: (provided) => ({
            ...provided,
            width: "300px",
            maxHeight: "90px",
            backgroundColor: "#313949",
            borderRadius: "50px",
            minHeight: "50px",
            padding: "4px",
            boxShadow: "none",
            outline: "none",
            boxShadow: "none",
            border: "none",
          }),
          valueContainer: (provided) => ({
            ...provided,
            maxHeight: "90px",
            overflowY: "auto",
            paddingRight: "5px",
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: "white",
            borderRadius: "50px",
            marginRight: "5px",
            marginBottom: "5px",
            color: "black",
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: "#313949",
          }),
          menu: (provided) => ({
            ...provided,
            maxHeight: "200px",
            overflowY: "auto",
            borderRadius: "50px",
            backgroundColor: "#313949",
          }),
          menuList: (provided) => ({
            ...provided,
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "#313949",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            borderRadius: "50px",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "grey" : "white",
            color: "#313949",
            borderRadius: "50px",
            marginBottom: "5px",
            marginLeft: "5px",
            marginRight: "5px",
            width: "200px",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            "&:hover": {
              backgroundColor: "rgb(104, 121, 155)",
              cursor: "pointer",
            },
            "&:active": {
              backgroundColor: "rgb(104, 121, 155)",
            },
          }),
        }}
      />
    </div>
  );

  // method to count the description/notes field characters
  const maxLengthDescription = 355;

  const handleDescriptionChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxLengthDescription) {
      setDescription(inputValue);
    }
  };

  // method to count the system requirements field characters
  const maxLengthSystemsRequirements = 355;

  const handleSystemRequirementsChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxLengthSystemsRequirements) {
      setSystemRequirements(inputValue);
    }
  };

  // method that adds floating point to versions that does not have
  const handleVersionChange = (version) => {
    const parsedVersion = parseFloat(version);

    if (!isNaN(parsedVersion) && Number.isInteger(parsedVersion)) {
      setVersion(parsedVersion.toFixed(1));
    } else {
      setVersion(version);
    }
  };

  return (
    // modal with the edit form
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
          backgroundColor: "rgb(219, 213, 201, 0.96)",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "87vh",
        }}
      >
        <div style={{ marginTop: "30px" }}>
          <div className="container-fluid">
            {/* edit software form  */}
            <form
              onSubmit={handleSubmitEditForm}
              className="container-fluid"
              style={{
                marginTop: "13px",
                border: "3px solid #313949",
                borderRadius: "50px",
                boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
              }}
            >
              <h3
                style={{
                  boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                  textAlign: "center",
                  marginBottom: "40px",
                  backgroundColor: "#313949",
                  color: "#daa520",
                  borderRadius: "50px",
                  height: "40px",
                  marginTop: "15px",
                }}
              >
                {" "}
                <MdModeEdit style={{ marginBottom: "4px" }} /> Edit Software
              </h3>
              {/* Software name field */}
              <Row
                className="justify-content-center"
                style={{ marginBottom: "25px" }}
              >
                <Col
                  xs={6}
                  className="text-center"
                  style={{ position: "relative" }}
                >
                  {" "}
                  <label htmlFor="name" style={{ color: "black" }}>
                    {" "}
                    <GrCloudSoftware
                      style={{ paddingBottom: "5px", fontSize: "22px" }}
                    />{" "}
                    Name:
                  </label>
                  <br />
                  <div>
                    <input
                      type="text"
                      id="name"
                      className="software-text"
                      value={name}
                      placeholder="Company Name"
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        height: "50px",
                        width: "400px",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    />
                    {name === "" && (
                      <CgDanger
                        className="danger-icon"
                        style={{
                          position: "absolute",
                          left: "22%",
                          top: "65%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </div>
                </Col>
              </Row>
              {/* Price, Licensing Options, Developer, Release Date fields */}
              <Row
                className="mt-4"
                style={{ marginBottom: "30px", marginTop: "20px" }}
              >
                <Col
                  className="text-center"
                  style={{ marginRight: "5px", position: "relative" }}
                >
                  <label htmlFor="name" style={{ color: "black" }}>
                    {" "}
                    <MdEuro
                      style={{ paddingBottom: "3px", fontSize: "20px" }}
                    />{" "}
                    Price/Month:
                  </label>
                  <br />
                  <NumberPicker
                    className="software-text custom-number-picker"
                    format={{ style: "currency", currency: "EUR" }}
                    defaultValue={0}
                    min={0}
                    value={parseFloat(price)}
                    onChange={(value) => setPrice(value)}
                    style={{ height: "50px" }}
                    placeholder="Select Price"
                  />
                  {price === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "10%",
                        top: "65%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </Col>
                <Col
                  className="text-center"
                  style={{ marginRight: "5px", position: "relative" }}
                >
                  <label htmlFor="licensingOptions" style={{ color: "black" }}>
                    {" "}
                    <TbLicense
                      style={{ paddingBottom: "3px", fontSize: "22px" }}
                    />{" "}
                    Licensing Options:
                  </label>
                  <br />
                  <LicensingDropdownList
                    options={licensingPeriods}
                    selectedOptions={licensingOptions}
                    onChange={(selectedOptions) =>
                      setLicensingOptions(
                        selectedOptions.map((option) => option.value)
                      )
                    }
                  />
                  {licensingOptions.length === 0 && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "10%",
                        top: "65%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </Col>
                <Col
                  className="text-center"
                  style={{ marginRight: "5px", position: "relative" }}
                >
                  <label htmlFor="name" style={{ color: "black" }}>
                    {" "}
                    <MdDeveloperBoard
                      style={{ paddingBottom: "3px", fontSize: "22px" }}
                    />{" "}
                    Developer:
                  </label>
                  <br />
                  <input
                    type="text"
                    id="name"
                    className="software-text"
                    placeholder="Software Developer"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    style={{
                      height: "50px",
                      width: "300px",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  />
                  {developer === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "10%",
                        top: "65%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </Col>
                <Col className="text-center" style={{ position: "relative" }}>
                  <label htmlFor="name" style={{ color: "black" }}>
                    {" "}
                    <FaCalendarAlt
                      style={{ paddingBottom: "5px", fontSize: "22px" }}
                    />{" "}
                    Release Date:
                  </label>
                  <br />
                  <DatePicker
                    className="software-date"
                    renderCustomHeader={({ date, changeYear, changeMonth }) => (
                      <div className="custom-header-container">
                        <select
                          className="year-picker"
                          value={getYear(date)}
                          onChange={(e) => changeYear(parseInt(e.target.value))}
                        >
                          {years.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        <select
                          className="month-picker"
                          value={months[getMonth(date)]}
                          onChange={(e) =>
                            changeMonth(months.indexOf(e.target.value))
                          }
                        >
                          {months.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    selected={releaseDate}
                    onChange={(releaseDate) => {
                      setReleaseDate(releaseDate);
                    }}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                  />
                  {releaseDate === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "10%",
                        top: "65%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </Col>
              </Row>
              {/* Version, Supported Platforms, Category fields */}
              <Row
                className="mt-4"
                style={{ marginBottom: "30px", marginTop: "20px" }}
              >
                <Col
                  className="text-center"
                  style={{
                    marginRight: "5px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <label
                    htmlFor="version"
                    style={{ color: "black", marginBottom: "0px" }}
                  >
                    {" "}
                    <GoVersions
                      style={{ paddingBottom: "5px", fontSize: "22px" }}
                    />{" "}
                    Version:
                  </label>
                  <NumberPicker
                    className="software-text custom-number-picker"
                    precision={1}
                    step={0.1}
                    min={0.1}
                    value={parseFloat(version)}
                    onChange={(version) => handleVersionChange(version)}
                    style={{ height: "50px", width: "300px" }}
                    placeholder="Select Version"
                  />
                  {version === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "19%",
                        top: "65%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </Col>

                <Col
                  className="text-center"
                  style={{
                    marginRight: "5px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <div>
                    <label htmlFor="name" style={{ color: "black" }}>
                      {" "}
                      <GiFlatPlatform
                        style={{ paddingBottom: "3px", fontSize: "22px" }}
                      />{" "}
                      Supported Platforms:
                    </label>
                  </div>
                  <PlatformsDropdownList
                    options={platforms}
                    selectedOptions={supportedPlatforms}
                    onChange={(selectedOptions) =>
                      setSupportedPlatforms(
                        selectedOptions.map((option) => option.value)
                      )
                    }
                  />
                  {supportedPlatforms.length === 0 && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "19%",
                        top: "65%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </Col>

                <Col
                  className="text-center"
                  style={{ marginRight: "5px", position: "relative" }}
                >
                  <label htmlFor="name" style={{ color: "black" }}>
                    {" "}
                    <TbCategory
                      style={{ paddingBottom: "5px", fontSize: "22px" }}
                    />{" "}
                    Category:
                  </label>
                  <br />
                  <select
                    id="category"
                    className="software-text"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                    style={{
                      height: "50px",
                      width: "300px",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="Utilities">Utilities</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Communication">Communication</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Education">Education</option>
                    <option value="Finance">Finance</option>
                    <option value="Health">Health</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>

                    <option value="Other">Other</option>
                  </select>
                  {category === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "19%",
                        top: "65%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </Col>
              </Row>
              {/* Description and System Requirements fields */}
              <Row
                className="mt-4"
                style={{ marginBottom: "25px", marginTop: "20px" }}
              >
                <Col className="text-center" style={{ marginRight: "5px" }}>
                  <label htmlFor="name" style={{ color: "black" }}>
                    {" "}
                    <TbFileDescription
                      style={{ paddingBottom: "3px", fontSize: "22px" }}
                    />{" "}
                    Description:
                  </label>
                  <br />
                  <textarea
                    id="notes"
                    className="software-text"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Description of the software..."
                    maxLength={maxLengthDescription}
                    style={{
                      width: "500px",
                      padding: "8px",
                      textAlign: "center",
                      height: "180px",
                      resize: "none",
                    }}
                  />
                  <div style={{ color: "#ff7b00", fontWeight: "bold" }}>
                    Characters Left: {maxLengthDescription - description.length}
                  </div>
                </Col>
                <Col className="text-center" style={{ marginRight: "5px" }}>
                  <label htmlFor="name" style={{ color: "black" }}>
                    {" "}
                    <GrSystem
                      style={{ paddingBottom: "3px", fontSize: "22px" }}
                    />{" "}
                    System Requirements:
                  </label>
                  <br />
                  <textarea
                    id="systemRequirements"
                    className="software-text"
                    value={systemRequirements}
                    onChange={handleSystemRequirementsChange}
                    placeholder="System Requirements of the software..."
                    maxLength={maxLengthSystemsRequirements}
                    style={{
                      width: "500px",
                      padding: "8px",
                      textAlign: "center",
                      height: "180px",
                      resize: "none",
                    }}
                  />
                  <div style={{ color: "#ff7b00", fontWeight: "bold" }}>
                    Characters Left:{" "}
                    {maxLengthSystemsRequirements - systemRequirements.length}
                  </div>
                </Col>
              </Row>

              <div
                className="mt-4 text-center"
                style={{ marginBottom: "15px" }}
              >
                {genericError && (
                  <p style={{ color: "#dc3545" }}>{genericError}</p>
                )}
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
      </div>
    </Modal>
  );
};
export default EditSoftwareModal;
