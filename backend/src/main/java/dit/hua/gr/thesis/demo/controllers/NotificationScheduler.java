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
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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

    @Autowired
    private ContactRepository contactRepository;

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");

    @Scheduled(cron = "0 0 20 * * ?")// Runs at midnight (12:00 AM) every day
    @Transactional
    public void sendReminderNotification() throws ParseException {

        // get the current date
        Calendar currentDateCalendar = Calendar.getInstance();

        // get the current date and time
        ZonedDateTime currentZoneDateTime = ZonedDateTime.now(ZoneId.of("Europe/Athens"));
        LocalDateTime currentDateTime = currentZoneDateTime.toLocalDateTime();

        // add three days to the current date
        currentDateCalendar.add(Calendar.DAY_OF_MONTH, 3);
        Date threeDaysFromNowFull = currentDateCalendar.getTime();

        // add seven days to the current date
        currentDateCalendar.add(Calendar.DAY_OF_MONTH, 4);
        Date sevenDaysFromNowFull = currentDateCalendar.getTime();

        // format dd-mm-yyyy in string
        String threeDaysFromNow = dateFormat.format(threeDaysFromNowFull);
        String sevenDaysFromNow = dateFormat.format(sevenDaysFromNowFull);

        List<Event> events = eventRepository.findAll();
        String subject = "Reminder";
        for (Event event : events) {

            // check if the event date is three days later than the current date
            if (dateFormat.format(event.getDate()).equals(threeDaysFromNow)) {

                List<User> users = new ArrayList<>(event.getUsers());
                List<Customer> customers = new ArrayList<>(event.getCustomers());
                List<Contact> contacts = new ArrayList<>(event.getContacts());

                for (User user : users) {

                    String content = "Don't forget, you have an event in three days!";
                    // create a reminder in-app notification
                    Notification inAppNotification = new Notification(NotificationType.IN_APP, content, Date.from(currentDateTime.atZone(ZoneId.systemDefault()).toInstant()), false);
                    inAppNotification.setEvent(event);
                    inAppNotification.setUser(user);
                    user.getNotifications().add(inAppNotification);

                    // create a reminder email notification
                    Notification emailNotification = new Notification(NotificationType.EMAIL, content, Date.from(currentDateTime.atZone(ZoneId.systemDefault()).toInstant()), false);
                    emailNotification.setEvent(event);
                    emailNotification.setUser(user);
                    user.getNotifications().add(emailNotification);
                    emailService.sendEmail(user.getEmail(), content, subject);

                    userRepository.save(user);

                }

                for (Customer customer : customers) {

                    String content = "Don't forget, you have an event in three days!";
                    // create a reminder email notification
                    Notification emailNotification = new Notification(NotificationType.EMAIL, content, Date.from(currentDateTime.atZone(ZoneId.systemDefault()).toInstant()), false);
                    emailNotification.setEvent(event);
                    emailNotification.setCustomer(customer);
                    customer.getNotifications().add(emailNotification);
                    emailService.sendEmail(customer.getEmail(), content, subject);

                    customerRepository.save(customer);

                }

                for (Contact contact : contacts) {

                    String content = "Don't forget, you have an event in three days!";
                    // create a reminder email notification
                    Notification emailNotification = new Notification(NotificationType.EMAIL, content, Date.from(currentDateTime.atZone(ZoneId.systemDefault()).toInstant()), false);
                    emailNotification.setEvent(event);
                    emailNotification.setContact(contact);
                    contact.getNotifications().add(emailNotification);
                    emailService.sendEmail(contact.getEmail(), content, subject);

                    contactRepository.save(contact);

                }
            }

        }

        List<Customer> customers = customerRepository.findAll();
        for (Customer customer : customers) {

            List<SoftwareLicense> softwareLicenses = customer.getSoftwareLicenses();
            List<SSLCertificate> sslCertificates = customer.getSslCertificates();

            // check the expiration date for every software license and send reminder if it's under 7 days
            for (SoftwareLicense softwareLicense : softwareLicenses) {
                if(dateFormat.format(softwareLicense.getExpirationDate()).equals(sevenDaysFromNow)){

                    String content = "Your software license for the " + softwareLicense.getSoftware().getName() + " software is expiring in 7 days," +
                            " don't forget to renew it !";
                    // create a reminder email notification
                    Notification emailNotification = new Notification(NotificationType.EMAIL, content, Date.from(currentDateTime.atZone(ZoneId.systemDefault()).toInstant()), false);

                    emailNotification.setCustomer(customer);
                    customer.getNotifications().add(emailNotification);
                    emailService.sendEmail(customer.getEmail(), content, subject);

                    customerRepository.save(customer);

                }
            }

            // check the expiration date for every ssl certificate and send reminder if it's under 7 days
            for (SSLCertificate sslCertificate : sslCertificates) {
                if(dateFormat.format(sslCertificate.getExpirationDate()).equals(sevenDaysFromNow)){

                    String content = "Your ssl Certificate is expiring in 7 days, don't forget to renew it !";
                    // create a reminder email notification
                    Notification emailNotification = new Notification(NotificationType.EMAIL, content, Date.from(currentDateTime.atZone(ZoneId.systemDefault()).toInstant()), false);

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

            // get the purchases of the software
            List<Purchase> purchases = theSoftware.getPurchases();

            // get the customers that have purchased the software
            List<Customer> customers = new ArrayList<>();
            for (Purchase thePurchase : purchases){
                 customers.add(thePurchase.getCustomer());
            }

            // add the event in the customer's list
            for (Customer customer : customers) {
                if (customer.getEvents() == null) {
                    customer.setEvents(new ArrayList<>());
                }
                customer.getEvents().add(event);
                createUpdateNotification(customer, event, theSoftware);
            }

            for (User user : userRepository.findAll()){
                if (user.getEvents() == null) {
                    user.setEvents(new ArrayList<>());
                }
                user.getEvents().add(event);
            }

            eventRepository.save(event);
        }
    }

    public void createUpdateNotification(Customer customer, Event event, Software software) {
        String content = "A new update event created for " + software.getName() + " for the 15th of this month !";
        String subject = "Update on the way !";

        // get the current date and time
        ZonedDateTime currentZoneDateTime = ZonedDateTime.now(ZoneId.of("Europe/Athens"));
        LocalDateTime localDateTime = currentZoneDateTime.toLocalDateTime();

        // Convert LocalDateTime to Date
        Instant instant = localDateTime.atZone(ZoneId.systemDefault()).toInstant();
        Date date = Date.from(instant);
        // Create an update email notification
        Notification emailNotification = new Notification(NotificationType.EMAIL, content, date, false);
        emailNotification.setEvent(event);
        emailNotification.setCustomer(customer);
        customer.getNotifications().add(emailNotification);
        emailService.sendEmail(customer.getEmail(), content, subject);
        customerRepository.save(customer);
    }


}
