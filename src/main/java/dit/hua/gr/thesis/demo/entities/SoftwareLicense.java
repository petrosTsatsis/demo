package dit.hua.gr.thesis.demo.entities;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.Date;

@Entity
@Table(name = "software_licences")
public class SoftwareLicense {

    // define fields

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "status")
    @NotBlank(message = "This field cannot be blank.")
    private String status;

    @Column(name = "activation_date")
    @Temporal(TemporalType.DATE)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @JsonSerialize(using = CustomDateSerializer.class)
    private Date activationDate;

    @Column(name = "expiration_date")
    @Temporal(TemporalType.DATE)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @JsonSerialize(using = CustomDateSerializer.class)
    private Date expirationDate;

    // customer relationship field
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "customer_id")
    private Customer customer;

    // software relationship field
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "software_id")
    private Software software;

    // define constructors

    public SoftwareLicense(String status, Date activationDate, Date expirationDate, Customer customer, Software software) {
        this.name = null;
        this.status = status;
        this.activationDate = activationDate;
        this.expirationDate = expirationDate;
        this.customer = customer;
        this.software = software;
    }

    public SoftwareLicense(){}

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getActivationDate() {
        return activationDate;
    }

    public void setActivationDate(Date activationDate) {
        this.activationDate = activationDate;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Software getSoftware() {
        return software;
    }

    public void setSoftware(Software software) {
        this.software = software;
    }

    // define toString method

    @Override
    public String toString() {
        return "SoftwareLicense{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", status='" + status + '\'' +
                ", activationDate=" + activationDate +
                ", expirationDate=" + expirationDate +
                '}';
    }
}
