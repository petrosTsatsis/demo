import React, { Component } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AboutUs from "./components/about";
import AuthenticatedHome from "./components/authenticated-home";
import AuthenticatedNavbar from "./components/authenticated-navbar";
import Calendar from "./components/calendar";
import AddCompany from "./components/company-components/add-company";
import DetailsCompany from "./components/company-components/details-company";
import ListCompanies from "./components/company-components/list-companies";
import AddContact from "./components/contact-components/add-contact";
import DetailsContact from "./components/contact-components/details-contact";
import ListContacts from "./components/contact-components/list-contacts";
import ContactUs from "./components/contact-us";
import AddCustomer from "./components/customer-components/add-customer";
import DetailsCustomer from "./components/customer-components/details-customer";
import ListCustomers from "./components/customer-components/list-customers";
import ListDashboards from "./components/dashboard-components/list-dashboards";
import AppointmentDetailsPage from "./components/events-components/appointment-details-page";
import ListTotalContacts from "./components/list-total-contacts";
import ListUsers from "./components/list-users";
import Login from "./components/login";
import DetailsNotification from "./components/notification-components/details-notification";
import UserDetails from "./components/profile-components/details-user";
import Profile from "./components/profile-components/profile";
import AddPurchase from "./components/purchase-components/add-purchase";
import DetailsPurchase from "./components/purchase-components/details-purchase";
import ListPurchases from "./components/purchase-components/list-purchases";
import Register from "./components/register";
import AddSoftware from "./components/software-components/add-software";
import DetailsSoftware from "./components/software-components/details.software";
import ListSoftware from "./components/software-components/list-software";
import DetailsSoftwareLicense from "./components/software-license-components/details-software-license";
import ListSoftwareLicenses from "./components/software-license-components/list-software-licenses";
import DetailsSSLCertificate from "./components/ssl-certificate-components/details-ssl-certificate";
import ListSSLCertificates from "./components/ssl-certificate-components/list-ssl-certificates";
import AddTask from "./components/task-components/add-task";
import DetailsTask from "./components/task-components/details-task";
import ListTasks from "./components/task-components/list-tasks";
import UnauthenticatedHome from "./components/unauthenticated-home";
import UnauthenticatedNavbar from "./components/unauthenticated-navbar";
import AuthService from "./services/auth-service";

const ProtectedRoute = ({ element }) => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return element;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showManagerBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showManagerBoard: user.roles?.includes("ROLE_MANAGER"),
        showAdminBoard: user.roles?.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showManagerBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    return (
      <Router>
        {this.state.currentUser === undefined ? (
          <UnauthenticatedNavbar />
        ) : (
          <AuthenticatedNavbar onLogout={this.logOut} />
        )}

        <Routes>
          <Route path="/signin" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route
            path="/Calendar"
            element={<ProtectedRoute element={<Calendar />} />}
          />
          <Route
            path="/Customers/add-customer"
            element={<ProtectedRoute element={<AddCustomer />} />}
          />

          <Route
            path="/Customers"
            element={<ProtectedRoute element={<ListCustomers />} />}
          />

          <Route
            path="/Customers/:id"
            element={<ProtectedRoute element={<DetailsCustomer />} />}
          />

          <Route
            path="/Companies"
            element={<ProtectedRoute element={<ListCompanies />} />}
          />

          <Route
            path="/Companies/add-company"
            element={<ProtectedRoute element={<AddCompany />} />}
          />

          <Route
            path="/Companies/:id"
            element={<ProtectedRoute element={<DetailsCompany />} />}
          />

          <Route
            path="/Software"
            element={<ProtectedRoute element={<ListSoftware />} />}
          />

          <Route
            path="/Software/add-software"
            element={<ProtectedRoute element={<AddSoftware />} />}
          />

          <Route
            path="/Software/:id"
            element={<ProtectedRoute element={<DetailsSoftware />} />}
          />

          <Route
            path="/Purchases"
            element={<ProtectedRoute element={<ListPurchases />} />}
          />

          <Route
            path="/Purchases/add-purchase"
            element={<ProtectedRoute element={<AddPurchase />} />}
          />

          <Route
            path="/Purchases/:id"
            element={<ProtectedRoute element={<DetailsPurchase />} />}
          />
          <Route
            path="/Notifications/:id"
            element={<ProtectedRoute element={<DetailsNotification />} />}
          />

          <Route
            path="/Contacts/MyContacts"
            element={<ProtectedRoute element={<ListContacts />} />}
          />

          <Route
            path="/Contacts/add-contact"
            element={<ProtectedRoute element={<AddContact />} />}
          />

          <Route
            path="/Contacts/:id"
            element={<ProtectedRoute element={<DetailsContact />} />}
          />

          <Route
            path="/Tasks/myTasks"
            element={<ProtectedRoute element={<ListTasks />} />}
          />

          <Route
            path="/Tasks/add-task"
            element={<ProtectedRoute element={<AddTask />} />}
          />

          <Route
            path="/Tasks/:id"
            element={<ProtectedRoute element={<DetailsTask />} />}
          />

          <Route
            path="/SoftwareLicenses"
            element={<ProtectedRoute element={<ListSoftwareLicenses />} />}
          />

          <Route
            path="/SoftwareLicenses/:id"
            element={<ProtectedRoute element={<DetailsSoftwareLicense />} />}
          />

          <Route
            path="/SSLCertificates"
            element={<ProtectedRoute element={<ListSSLCertificates />} />}
          />

          <Route
            path="/SSLCertificates/:id"
            element={<ProtectedRoute element={<DetailsSSLCertificate />} />}
          />

          <Route
            path="/Dashboards"
            element={<ProtectedRoute element={<ListDashboards />} />}
          />

          <Route
            path="/Profile"
            element={<ProtectedRoute element={<Profile />} />}
          />

          <Route
            path="/Users/:id"
            element={<ProtectedRoute element={<UserDetails />} />}
          />

          <Route
            path="/signup"
            element={
              <ProtectedRoute
                element={
                  <React.Fragment>
                    {AuthService.getCurrentUser() &&
                    AuthService.getCurrentUser().roles.includes(
                      "ROLE_ADMIN"
                    ) ? (
                      <Register />
                    ) : (
                      <Navigate to="/home" />
                    )}
                  </React.Fragment>
                }
              />
            }
          />

          <Route
            path="/Users"
            element={
              <ProtectedRoute
                element={
                  <React.Fragment>
                    {AuthService.getCurrentUser() &&
                    AuthService.getCurrentUser().roles.includes(
                      "ROLE_ADMIN"
                    ) ? (
                      <ListUsers />
                    ) : (
                      <Navigate to="/home" />
                    )}
                  </React.Fragment>
                }
              />
            }
          />

          <Route
            path="/Contacts"
            element={
              <ProtectedRoute
                element={
                  <React.Fragment>
                    {AuthService.getCurrentUser() &&
                    AuthService.getCurrentUser().roles.includes(
                      "ROLE_ADMIN"
                    ) ? (
                      <ListTotalContacts />
                    ) : (
                      <Navigate to="/home" />
                    )}
                  </React.Fragment>
                }
              />
            }
          />

          <Route
            path="/Events/:id"
            element={<ProtectedRoute element={<AppointmentDetailsPage />} />}
          />

          {this.state.currentUser === undefined ? (
            <Route path="/" element={<UnauthenticatedHome />} />
          ) : (
            <Route path="/home" element={<AuthenticatedHome />} />
          )}
        </Routes>
      </Router>
    );
  }
}

export default App;
