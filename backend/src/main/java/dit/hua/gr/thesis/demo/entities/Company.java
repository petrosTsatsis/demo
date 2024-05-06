package dit.hua.gr.thesis.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

@Entity
@Table(name = "companies")
public class Company extends Customer{

    // define fields
    @NotBlank(message = "This field cannot be blank.")
    @Column(name = "name")
    private String name;

    @Column(name = "website")
    private String website;

    @Column(name = "industry")
    private String industry;

    @Column(name = "annual_revenue")
    private double annualRevenue;

    @Column(name = "employees_number")
    private long employeesNumber;

    @Column(name = "description", length = 355)
    private String description;

    @OneToMany(mappedBy = "company", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JsonIgnore
    private List<Contact> contacts;

    // define constructors

    public Company(String name, String website, String industry, double annualRevenue, String phoneNumber, String email, long employeesNumber, String description) {
        super(null, null, phoneNumber, email, null);
        this.name = name;
        this.website = website;
        this.industry = industry;
        this.annualRevenue = annualRevenue;
        this.employeesNumber = employeesNumber;
        this.description = description;
    }

    public Company(){}

    // define getters/setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public double getAnnualRevenue() {
        return annualRevenue;
    }

    public void setAnnualRevenue(double annualRevenue) {
        this.annualRevenue = annualRevenue;
    }

    public long getEmployeesNumber() {
        return employeesNumber;
    }

    public void setEmployeesNumber(long employeesNumber) {
        this.employeesNumber = employeesNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Contact> getContacts() {
        return contacts;
    }

    public void setContacts(List<Contact> contacts) {
        this.contacts = contacts;
    }

    // define toString method

    @Override
    public String toString() {
        return "Company{" +
                ", name='" + name + '\'' +
                ", website='" + website + '\'' +
                ", industry='" + industry + '\'' +
                ", annualRevenue=" + annualRevenue +
                ", employeesNumber=" + employeesNumber +
                ", description='" + description + '\'' +
                '}';
    }
}
