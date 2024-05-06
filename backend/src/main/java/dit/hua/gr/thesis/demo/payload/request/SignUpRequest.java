package dit.hua.gr.thesis.demo.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public class SignUpRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    private Set<String> role;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank(message = "This field cannot be blank.")
    @Size(max = 30)
    private String fname;

    @NotBlank(message = "This field cannot be blank.")
    @Size(max = 30)
    private String lname;

    @Size(max = 120)
    private String description;

    @NotBlank(message = "This field cannot be blank.")
    @Size(max = 10, min = 10, message = "Please type a valid phone number.")
    protected String phoneNumber;

    public SignUpRequest(String username, String email, Set<String> role, String password, String fname, String lname, String phoneNumber) {
        this.username = username;
        this.email = email;
        this.role = role;
        this.password = password;
        this.fname = fname;
        this.lname = lname;
        this.phoneNumber = phoneNumber;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRole() {
        return this.role;
    }

    public void setRole(Set<String> role) {
        this.role = role;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

}