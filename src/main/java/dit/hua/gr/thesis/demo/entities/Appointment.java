package dit.hua.gr.thesis.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "appointments")
public class Appointment extends Event{

    // define fields

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "start_time")
    @NotBlank(message = "This field cannot be blank.")
    private String startTime;

    @Column(name = "end_time")
    @NotBlank(message = "This field cannot be blank.")
    private String endTime;

    @Column(name = "call_url")
    private String callUrl;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private Customer customer;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "manager_id")
    @JsonIgnore
    private Manager manager;

    // define constructors

    public Appointment(String date, String type, String startTime, String endTime, String callUrl) {
        super(date, type);
        this.startTime = startTime;
        this.endTime = endTime;
        this.callUrl = callUrl;
    }

    public Appointment(String startTime, String endTime, String callUrl) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.callUrl = callUrl;
    }

    public Appointment(){}

    // define getters/setters

    @Override
    public int getId() {
        return id;
    }

    @Override
    public void setId(int id) {
        this.id = id;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getCallUrl() {
        return callUrl;
    }

    public void setCallUrl(String callUrl) {
        this.callUrl = callUrl;
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

    // define toString method

    @Override
    public String toString() {
        return "Appointment{" +
                "id=" + id +
                ", startTime='" + startTime + '\'' +
                ", endTime='" + endTime + '\'' +
                ", callUrl='" + callUrl + '\'' +
                ", customer=" + customer +
                ", manager=" + manager +
                '}';
    }
}
