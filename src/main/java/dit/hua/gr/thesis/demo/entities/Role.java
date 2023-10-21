package dit.hua.gr.thesis.demo.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;

    // define constructors

    public Role(ERole name) {
        this.name = name;
    }

    public Role() {}

    // define getters/setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ERole getName() {
        return name;
    }

    public void setName(ERole name) {
        this.name = name;
    }

    // define toString method

    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", name=" + name +
                '}';
    }
}
