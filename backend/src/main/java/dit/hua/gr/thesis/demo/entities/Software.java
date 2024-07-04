package dit.hua.gr.thesis.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "software")
public class Software {

    // define fields

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "name")
    @NotBlank(message = "This field cannot be blank.")
    private String name;

    @Column(name = "description", length = 355)
    private String description;

    @Column(name = "version")
    @NotBlank(message = "This field cannot be blank.")
    private String version;

    @Column(name = "category")
    @NotBlank(message = "This field cannot be blank.")
    private String category;

    @Column(name = "price")
    @NotNull(message = "This field cannot be blank.")
    private double price;

    @Column(name = "system_requirements", length = 355)
    private String systemRequirements;

    @Column(name = "licensing_options")
    @ElementCollection
    private List<String> licensingOptions;

    @Column(name = "supported_platforms")
    @ElementCollection
    private List<String> supportedPlatforms;

    @Column(name = "release_date")
    @Temporal(TemporalType.DATE)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @JsonSerialize(using = CustomDateSerializer.class)
    private Date releaseDate;

    @Column(name = "developer")
    @NotBlank(message = "This field cannot be blank.")
    private String developer;

    @Column(name = "registration_date")
    @Temporal(TemporalType.DATE)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @JsonSerialize(using = CustomDateSerializer.class)
    private Date registrationDate;

    // event relationship field
    @OneToMany(mappedBy = "software",
            cascade = {CascadeType.ALL})
    @JsonIgnore
    private List<Event> events;

    // purchase relationship field
    @OneToMany(mappedBy = "software",
            cascade = {CascadeType.ALL})
    @JsonIgnore
    private List<Purchase> purchases;

    // software license relationship field
    @OneToMany(mappedBy = "software",
            cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SoftwareLicense> softwareLicenses;

    // define constructors

    public Software(String name, String description, String version, String category, double price, String systemRequirements, List<String> licensingOptions, List<String> supportedPlatforms, Date releaseDate, String developer) {
        this.name = name;
        this.description = description;
        this.version = version;
        this.category = category;
        this.price = price;
        this.systemRequirements = systemRequirements;
        this.licensingOptions = licensingOptions;
        this.supportedPlatforms = supportedPlatforms;
        this.releaseDate = releaseDate;
        this.developer = developer;
    }

    public Software(){}

    // define getters/setters

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getSystemRequirements() {
        return systemRequirements;
    }

    public void setSystemRequirements(String systemRequirements) {
        this.systemRequirements = systemRequirements;
    }

    public List<String> getLicensingOptions() {
        return licensingOptions;
    }

    public void setLicensingOptions(List<String> licensingOptions) {
        this.licensingOptions = licensingOptions;
    }

    public List<String> getSupportedPlatforms() {
        return supportedPlatforms;
    }

    public void setSupportedPlatforms(List<String> supportedPlatforms) {
        this.supportedPlatforms = supportedPlatforms;
    }

    public Date getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(Date releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getDeveloper() {
        return developer;
    }

    public void setDeveloper(String developer) {
        this.developer = developer;
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
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

    // define toString method

    @Override
    public String toString() {
        return "Software{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", version='" + version + '\'' +
                ", category='" + category + '\'' +
                ", price=" + price +
                ", systemRequirements='" + systemRequirements + '\'' +
                ", licensingOptions='" + licensingOptions + '\'' +
                ", supportedPlatforms='" + supportedPlatforms + '\'' +
                ", releaseDate=" + releaseDate +
                ", developer='" + developer + '\'' +
                ", registrationDate=" + registrationDate +
                '}';
    }
}
