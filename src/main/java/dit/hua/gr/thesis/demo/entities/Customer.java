package dit.hua.gr.thesis.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "customers")
public class Customer{

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "first_name")
    @NotBlank(message = "This field cannot be blank.")
    @Size(max = 30)
    private String fname;

    @Column(name = "last_name")
    @NotBlank(message = "This field cannot be blank.")
    @Size(max = 30)
    private String lname;

    @Column(name = "phone_number")
    @NotBlank(message = "This field cannot be blank.")
    @Size(max = 10, min = 10, message = "Please type a valid phone number.")
    private String phoneNumber;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @Column(name = "registration_date")
    @Temporal(TemporalType.DATE)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @JsonSerialize(using = CustomDateSerializer.class)
    private Date registrationDate;

    // software relationship field
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(
            name = "customer_softwares",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "software_id"))
    @JsonIgnore
    private List<Software> softwares;

    // event relationship field
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(
            name = "customer_events",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "event_id"))
    @JsonIgnore
    private List<Event> events;

    // notification relationship field
    @OneToMany(mappedBy = "customer",
            cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Notification> notifications;

    // purchase relationship field
    @OneToMany(mappedBy = "customer",
            cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Purchase> purchases;

    // software license relationship field
    @OneToMany(mappedBy = "customer",
            cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SoftwareLicense> softwareLicenses;

    // SSL certificate relationship field
    @OneToMany(mappedBy = "customer",
            cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SSLCertificate> sslCertificates;

    // organization relationship field
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "organization_id")
    @JsonIgnore
    private Organization organization;


    // define constructors
    public Customer(String fname, String lname, String phoneNumber, String email) {
        this.fname = fname;
        this.lname = lname;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

    public Customer(){}

    // define getters/setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    public List<Software> getSoftwares() {
        return softwares;
    }

    public void setSoftwares(List<Software> softwares) {
        this.softwares = softwares;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }
    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public List<Purchase> getPurchases() {
        return purchases;
    }

    public void setPurchases(List<Purchase> purchases) {
        this.purchases = purchases;
    }

    public List<SoftwareLicense> getSoftwareLicenses() {
        return softwareLicenses;
    }

    public void setSoftwareLicenses(List<SoftwareLicense> softwareLicenses) {
        this.softwareLicenses = softwareLicenses;
    }

    public List<SSLCertificate> getSslCertificates() {
        return sslCertificates;
    }

    public void setSslCertificates(List<SSLCertificate> sslCertificates) {
        this.sslCertificates = sslCertificates;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    // define toString method
    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", fname='" + fname + '\'' +
                ", lname='" + lname + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", registrationDate=" + registrationDate +
                '}';
    }
}
