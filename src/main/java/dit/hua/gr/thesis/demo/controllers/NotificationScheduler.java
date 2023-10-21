package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.*;
import dit.hua.gr.thesis.demo.repositories.*;
import dit.hua.gr.thesis.demo.service.EmailService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Component
public class NotificationScheduler {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SoftwareRepository softwareRepository;

    @Autowired
    private EmailService emailService;

    private SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");

    @Scheduled(cron = "0 0 14 21 10 ?", zone = "Europe/Athens") // Runs at midnight (12:00 AM) every day
    @Transactional
    public void sendReminderNotification() throws ParseException {

        System.out.println("---------------I AM RUNNING-----------------------");

        // get the current date
        Calendar currentDateCalendar = Calendar.getInstance();

        // add three days to the current date
        currentDateCalendar.add(Calendar.DAY_OF_MONTH, 3);
        Date threeDaysFromNowFull = currentDateCalendar.getTime();

        // format dd-mm-yyyy in string
        String threeDaysFromNow = dateFormat.format(threeDaysFromNowFull);

        List<Event> events = eventRepository.findAll();
        for (Event event : events) {

            // check if the event date is three days later than the current date
            if (dateFormat.format(event.getDate()).equals(threeDaysFromNow)) {

                List<User> users = new ArrayList<>(event.getUsers());
                List<Customer> customers = new ArrayList<>(event.getCustomers());

                for (User user : users) {
                    String content = "Don't forget, you have an event in three days!";
                    String subject = "Reminder";

                    // create a reminder in-app notification
                    Notification inAppNotification = new Notification(NotificationType.IN_APP, content, event.getDate(), "unread");
                    inAppNotification.setEvent(event);
                    inAppNotification.setUser(user);
                    user.getNotifications().add(inAppNotification);

                    // create a reminder email notification
                    Notification emailNotification = new Notification(NotificationType.EMAIL, content, event.getDate(), "unread");
                    emailNotification.setEvent(event);
                    emailNotification.setUser(user);
                    user.getNotifications().add(emailNotification);
                    emailService.sendEmail(user.getEmail(), content, subject);

                    userRepository.save(user);

                }

                for (Customer customer : customers) {
                    String content = "Don't forget, you have an event in three days!";
                    String subject = "Reminder";

                    // create a reminder email notification
                    Notification emailNotification = new Notification(NotificationType.EMAIL, content, event.getDate(), "unread");
                    emailNotification.setEvent(event);
                    emailNotification.setCustomer(customer);
                    customer.getNotifications().add(emailNotification);
                    emailService.sendEmail(customer.getEmail(), content, subject);

                    customerRepository.save(customer);

                }
            }
        }
    }

    @Scheduled(cron = "0 0 0 1 * ?", zone = "Europe/Athens") // Runs at midnight on the 1st day of every month
    @Transactional
    public void createUpdateEvent() throws ParseException {
        // Get the current year and month
        Calendar calendar = Calendar.getInstance();

        // Set the day to 15 and create a Date object
        calendar.set(Calendar.DAY_OF_MONTH, 15);
        Date updateDate = calendar.getTime();

        String title = "Update time !";
        String description = "This is a new update where we will add new features, fix bugs and improve your experience, stay tuned !";

        List<Software> software = softwareRepository.findAll();

        for (Software theSoftware : software) {
            // create the event for each software
            Event event = new Event(updateDate, title, description);
            event.setSoftware(theSoftware);
            List<Customer> customers = theSoftware.getCustomers();

            // add the event in the customer's list
            for (Customer customer : customers) {
                customer.getEvents().add(event);
                createUpdateNotification(customer, event, theSoftware);
            }
        }
    }

    public void createUpdateNotification(Customer customer, Event event, Software software) {
        String content = "A new update event created for " + software.getName() + " for the 15th of this month"  + " !";
        String subject = "Update on the way !";

        // Create a update email notification
        Notification emailNotification = new Notification(NotificationType.EMAIL, content, event.getDate(), "unread");
        emailNotification.setEvent(event);
        emailNotification.setCustomer(customer);
        customer.getNotifications().add(emailNotification);
        emailService.sendEmail(customer.getEmail(), content, subject);
        customerRepository.save(customer);
    }




}
