package dit.hua.gr.thesis.demo.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "events")
@Inheritance(strategy = InheritanceType.JOINED)
public class Event {

    // define fields

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "date")
    @NotBlank(message = "This field cannot be blank.")
    private String date;

    @Column(name = "type")
    @NotBlank(message = "This field cannot be blank.")
    private String type;

    // define constructors

    public Event(String date, String type) {
        this.date = date;
        this.type = type;
    }

    public Event(){}

    // define getters/setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    // define toString method

    @Override
    public String toString() {
        return "Event{" +
                "id=" + id +
                ", date='" + date + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}
