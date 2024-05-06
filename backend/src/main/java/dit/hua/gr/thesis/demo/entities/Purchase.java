package dit.hua.gr.thesis.demo.entities;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

@Entity
@Table(name = "purchases")
public class Purchase {

    // define fields

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "price")
    @NotNull(message = "This field cannot be blank.")
    private double price;

    @Column(name = "purchase_date")
    @Temporal(TemporalType.DATE)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @JsonSerialize(using = CustomDateSerializer.class)
    private Date purchaseDate;

    @Column(name = "licensing_option")
    @NotBlank(message = "This field cannot be blank.")
    private String licensingOption;

    @Column(name = "registration_date")
    @Temporal(TemporalType.DATE)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @JsonSerialize(using = CustomDateSerializer.class)
    private Date registrationDate;

    // customer relationship field
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "customer_id")
    private Customer customer;

    // software relationship field
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "software_id")
    private Software software;

    // define constructors

    public Purchase(double price, Date purchaseDate, String licensingOption, Customer customer, Software software) {
        this.price = price;
        this.purchaseDate = purchaseDate;
        this.licensingOption = licensingOption;
        this.customer = customer;
        this.software = software;
    }

    public Purchase(){}

    // define getters/setters

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Date getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(Date purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getLicensingOption() {
        return licensingOption;
    }

    public void setLicensingOption(String licensingOption) {
        this.licensingOption = licensingOption;
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

    public Software getSoftware() {
        return software;
    }

    public void setSoftware(Software software) {
        this.software = software;
    }


    // define toString method

    @Override
    public String toString() {
        return "Purchase{" +
                "id=" + id +
                ", price=" + price +
                ", purchaseDate=" + purchaseDate +
                ", licensingOption='" + licensingOption + '\'' +
                ", registrationDate=" + registrationDate +
                '}';
    }
}
