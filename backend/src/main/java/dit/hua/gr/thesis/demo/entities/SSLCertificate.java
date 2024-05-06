package dit.hua.gr.thesis.demo.entities;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.Date;

@Entity
@Table(name = "sslcertificates")
public class SSLCertificate {

    // define fields

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "type")
    @NotBlank(message = "This field cannot be blank.")
    private String type;

    @Column(name = "status")
    private String status;

    @Column(name = "issuer")
    @NotBlank(message = "This field cannot be blank.")
    private String issuer;

    @Column(name = "expiration_date")
    @Temporal(TemporalType.DATE)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @JsonSerialize(using = CustomDateSerializer.class)
    private Date expirationDate;

    @Column(name = "registration_date")
    @Temporal(TemporalType.DATE)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @JsonSerialize(using = CustomDateSerializer.class)
    private Date registrationDate;

    // customer relationship field
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "customer_id")
    private Customer customer;

    // define constructors
    public SSLCertificate(String type, String issuer, Date expirationDate) {
        this.type = type;
        this.issuer = issuer;
        this.expirationDate = expirationDate;
    }

    public SSLCertificate(){}

    // define getters/setters

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    // define toString method
    @Override
    public String toString() {
        return "SSLCertificate{" +
                "id=" + id +
                ", type='" + type + '\'' +
                ", status='" + status + '\'' +
                ", issuer='" + issuer + '\'' +
                ", expirationDate=" + expirationDate +
                ", registrationDate=" + registrationDate +
                '}';
    }
}
