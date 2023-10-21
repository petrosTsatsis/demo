package dit.hua.gr.thesis.demo.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "organizations")
public class Organization extends Customer{

    // define fields

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    @NotBlank(message = "This field cannot be blank.")
    private String name;

    // customer certificate relationship field
    @OneToMany(mappedBy = "organization",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JsonIgnore
    private List<Customer> Customer;

    // define constructors

    public Organization(String name) {
        this.name = name;
    }

    public Organization(){}

    // define getters/setters

    @Override
    public int getId() {
        return id;
    }

    @Override
    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<dit.hua.gr.thesis.demo.entities.Customer> getCustomer() {
        return Customer;
    }

    public void setCustomer(List<dit.hua.gr.thesis.demo.entities.Customer> customer) {
        Customer = customer;
    }

    // define toString method
    @Override
    public String toString() {
        return "Organization{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
