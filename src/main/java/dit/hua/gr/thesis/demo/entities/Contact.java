package dit.hua.gr.thesis.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "contacts")
public class Contact {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    @NotBlank(message = "This field cannot be blank.")
    @Size(max = 30)
    private String name;

    @Column(name = "title")
    @NotBlank(message = "This field cannot be blank.")
    @Size(max = 30)
    private String title;

    @Column(name = "type")
    @NotBlank(message = "This field cannot be blank.")
    @Size(max = 30)
    private String type;

    @Column(name = "priority")
    @NotBlank(message = "This field cannot be blank.")
    @Size(max = 30)
    private String priority;

    @Column(name = "phone_number")
    @NotBlank(message = "This field cannot be blank.")
    @Size(max = 10, min = 10, message = "Please type a valid phone number.")
    private String phoneNumber;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @Column(name = "notes")
    private String notes;

    // customer relationship field
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private Customer customer;

    // user relationship field
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    // define constructors
    public Contact(String name, String title, String type, String priority, String phoneNumber, String email, String notes) {
        this.name = name;
        this.title = title;
        this.type = type;
        this.priority = priority;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.notes = notes;
    }

    public Contact(){}

    // define getters/setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // define toString method

    @Override
    public String toString() {
        return "Contact{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", title='" + title + '\'' +
                ", type='" + type + '\'' +
                ", priority='" + priority + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", email='" + email + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }
}
