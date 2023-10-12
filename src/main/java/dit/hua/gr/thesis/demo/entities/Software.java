package dit.hua.gr.thesis.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "softwares")
public class Software {

    // define fields

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    @NotBlank(message = "This field cannot be blank.")
    private String name;

    @Column(name = "version")
    @NotBlank(message = "This field cannot be blank.")
    private String version;

    @Column(name = "description")
    @NotBlank(message = "This field cannot be blank.")
    private String description;

    @Column(name = "environment")
    @NotBlank(message = "This field cannot be blank.")
    private String environment;

    @ManyToMany(mappedBy = "softwares")
    @JsonIgnore
    private List<Customer> customers;

    @ManyToMany(mappedBy = "softwares")
    @JsonIgnore
    private List<Manager> managers;

    @OneToOne(mappedBy = "software", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.DETACH})
    private Purchase purchase;

    // define constructors

    public Software(String name, String version, String description, String environment) {
        this.name = name;
        this.version = version;
        this.description = description;
        this.environment = environment;
    }

    public Software(){}

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

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public List<Customer> getCustomers() {
        return customers;
    }

    public void setCustomers(List<Customer> customers) {
        this.customers = customers;
    }

    public List<Manager> getManagers() {
        return managers;
    }

    public void setManagers(List<Manager> managers) {
        this.managers = managers;
    }

    public Purchase getPurchase() {
        return purchase;
    }

    public void setPurchase(Purchase purchase) {
        this.purchase = purchase;
    }

    // define toString method

    @Override
    public String toString() {
        return "Software{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", version='" + version + '\'' +
                ", description='" + description + '\'' +
                ", environment='" + environment + '\'' +
                ", customers=" + customers +
                ", managers=" + managers +
                ", purchase=" + purchase +
                '}';
    }
}
