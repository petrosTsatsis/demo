package dit.hua.gr.thesis.demo.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "appointments")
public class Appointment extends Event{

    // define fields

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "start_time")
    @NotBlank(message = "This field cannot be blank.")
    private String startTime;

    @Column(name = "end_time")
    @NotBlank(message = "This field cannot be blank.")
    private String endTime;

    @Column(name = "call_url")
    private String callUrl;

    @Column(name = "type")
    @NotBlank(message = "This field cannot be blank.")
    private String type;

    @Column(name = "related_to")
    @NotBlank(message = "This field cannot be blank.")
    private String relatedTo;


    // define constructors
    public Appointment(Date date, String title, String description, String startTime, String endTime, String callUrl, String type, String relatedTo) {
        super(date, title, description);
        this.startTime = startTime;
        this.endTime = endTime;
        this.callUrl = callUrl;
        this.type = type;
        this.relatedTo = relatedTo;
    }

    public Appointment(Date date, String title, String description, List<Customer> customers, List<Contact> contacts, String startTime, String endTime, String callUrl, String type, String relatedTo) {
        super(date, title, description, customers, contacts);
        this.startTime = startTime;
        this.endTime = endTime;
        this.callUrl = callUrl;
        this.type = type;
        this.relatedTo = relatedTo;
    }

    public Appointment(){}

    // define getters/setters

    @Override
    public long getId() {
        return id;
    }

    @Override
    public void setId(long id) {
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRelatedTo() {
        return relatedTo;
    }

    public void setRelatedTo(String relatedTo) {
        this.relatedTo = relatedTo;
    }

    // define toString method
}
