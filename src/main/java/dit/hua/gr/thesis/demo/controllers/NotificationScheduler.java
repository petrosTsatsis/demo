package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.*;
import dit.hua.gr.thesis.demo.repositories.CustomerRepository;
import dit.hua.gr.thesis.demo.repositories.ManagerRepository;
import dit.hua.gr.thesis.demo.repositories.UserRepository;
import dit.hua.gr.thesis.demo.service.EventService;
import dit.hua.gr.thesis.demo.service.NotificationService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private EventService eventService;

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");

    @Scheduled(cron = "0 0 0 * * ?") // Runs at midnight (12:00 AM) every day
    @Transactional
    public void sendReminderNotification() throws ParseException {

        // get the current date
        Calendar currentDateCalendar = Calendar.getInstance();

        // add three days to the current date
        currentDateCalendar.add(Calendar.DAY_OF_MONTH, 3);
        Date threeDaysFromNowFull = currentDateCalendar.getTime();
        // format dd-mm-yyyy in string
        String threeDaysFromNow = dateFormat.format(threeDaysFromNowFull);

        List<Event> events = eventService.findAll();
        for (Event event : events) {

            // check if the event date is three days later than the current date
            if (threeDaysFromNow.equals(event.getDate()) ) {

                List<User> users = new ArrayList<>(event.getUsers());

                for (User user : users) {
                    if (!isNotificationSent(user, event)) {

                        String content = "Don't forget, you have an event in three days!";
                        // create a reminder notification
                        Notification notification = new Notification(NotificationType.IN_APP, content, event.getDate(), "unread");
                        notification.setEvent(event);

                        // check if the user is a Customer or Manager and save the notification accordingly
                        if (user instanceof Customer) {
                            ((Customer) user).getNotifications().add(notification);
                            customerRepository.save((Customer) user);
                        } else if (user instanceof Manager) {
                            ((Manager) user).getNotifications().add(notification);
                            managerRepository.save((Manager) user);
                        }
                    }
                }
            }
        }
    }

    // check if a notification has already been sent to the user for the event
    private boolean isNotificationSent(User user, Event currentEvent) {
        List<Notification> notifications;

        if (user instanceof Customer) {
            notifications = ((Customer) user).getNotifications();
        } else if (user instanceof Manager) {
            notifications = ((Manager) user).getNotifications();
        } else {
            return false;
        }

        for (Notification notification : notifications) {
            Event event = notification.getEvent();
            if (event != null && event.getId() == currentEvent.getId()) {
                return true; // notification for the current event has already been sent
            }
        }
        return false; // notification for the current event has not been sent
    }

    // send a welcome notification to the new customer
    @Transactional
    public void sendNotificationAfterSignUp(User user){

        Calendar calendar = Calendar.getInstance();
        Date notificationDate = calendar.getTime();

        String content = "Welcome to our application !";
        Notification notification = new Notification(NotificationType.IN_APP, content, dateFormat.format(notificationDate), "unread");

        if (user instanceof Customer) {
            ((Customer) user).getNotifications().add(notification);
            customerRepository.save((Customer) user);
        } else if (user instanceof Manager) {
            ((Manager) user).getNotifications().add(notification);
            managerRepository.save((Manager) user);
        }

    }




}
