package dit.hua.gr.thesis.demo.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "managers")
@PrimaryKeyJoinColumn(name = "user_id")
public class Manager extends User{

    // define fields

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

    @OneToMany(mappedBy = "manager",
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.REMOVE})
    @JsonIgnore
    private List<Appointment> appointments;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.REMOVE})
    @JoinTable(
            name = "manager_notifications",
            joinColumns = @JoinColumn(name = "manager_id"),
            inverseJoinColumns = @JoinColumn(name = "notification_id"))
    @JsonIgnore
    private List<Notification> notifications;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(
            name = "manager_softwares",
            joinColumns = @JoinColumn(name = "manager_id"),
            inverseJoinColumns = @JoinColumn(name = "software_id"))
    @JsonIgnore
    private List<Software> softwares;

    @OneToMany(mappedBy = "manager",
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JsonIgnore
    private List<Purchase> purchases;

    // define constructors

    public Manager(String username, String password, String email, String fname, String lname, String phoneNumber) {
        super(username, password, email);
        this.fname = fname;
        this.lname = lname;
        this.phoneNumber = phoneNumber;
    }

    public Manager(String fname, String lname, String phoneNumber) {
        this.fname = fname;
        this.lname = lname;
        this.phoneNumber = phoneNumber;
    }

    public Manager(){}

    // define getters/setters

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

    public List<Appointment> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<Appointment> appointments) {
        this.appointments = appointments;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public List<Software> getSoftwares() {
        return softwares;
    }

    public void setSoftwares(List<Software> softwares) {
        this.softwares = softwares;
    }

    public List<Purchase> getPurchases() {
        return purchases;
    }

    public void setPurchases(List<Purchase> purchases) {
        this.purchases = purchases;
    }

    // define toString method

    @Override
    public String toString() {
        return "Manager{" +
                ", fname='" + fname + '\'' +
                ", lname='" + lname + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                '}';
    }
}