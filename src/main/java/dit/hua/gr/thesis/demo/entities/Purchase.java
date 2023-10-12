package dit.hua.gr.thesis.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.aspectj.weaver.ast.Not;

@Entity
@Table(name = "purchases")
public class Purchase {

    // define fields

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "cost")
    @NotBlank(message = "This field cannot be blank.")
    private double cost;

    @Column(name = "purchase_date")
    @NotBlank(message = "This field cannot be blank.")
    private String purchaseDate;

    @Column(name = "expiration_date")
    @NotBlank(message = "This field cannot be blank.")
    private String expirationDate;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private Customer customer;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "manager_id")
    @JsonIgnore
    private Manager manager;

    @OneToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "software_id")
    private Software software;

    // define constructors

    public Purchase(double cost, String purchaseDate, String expirationDate) {
        this.cost = cost;
        this.purchaseDate = purchaseDate;
        this.expirationDate = expirationDate;
    }

    public Purchase(){}

    // define getters/setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }

    public String getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(String purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Manager getManager() {
        return manager;
    }

    public void setManager(Manager manager) {
        this.manager = manager;
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
                ", cost=" + cost +
                ", purchaseDate='" + purchaseDate + '\'' +
                ", expirationDate='" + expirationDate + '\'' +
                ", customer=" + customer +
                ", manager=" + manager +
                ", software=" + software +
                '}';
    }
}
