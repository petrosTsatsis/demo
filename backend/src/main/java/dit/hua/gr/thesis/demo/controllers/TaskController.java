package dit.hua.gr.thesis.demo.controllers;

import dit.hua.gr.thesis.demo.entities.Activity;
import dit.hua.gr.thesis.demo.entities.Task;
import dit.hua.gr.thesis.demo.entities.User;
import dit.hua.gr.thesis.demo.repositories.ActivityRepository;
import dit.hua.gr.thesis.demo.repositories.TaskRepository;
import dit.hua.gr.thesis.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityRepository activityRepository;

    // get all tasks
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public List<Task> getAll(){
        return taskRepository.findAll();
    }

    // get task by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/{task_id}")
    public ResponseEntity<?> getTask(@PathVariable long task_id) {
        Optional<Task> optionalTask = taskRepository.findById(task_id);
        if(optionalTask.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Task with ID : " + task_id + " not found !"
            );
        }
        Task task = optionalTask.get();

        return ResponseEntity.ok(task);
    }

    // add a task
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PostMapping("/add-task")
    public ResponseEntity<String> addTask(@Validated @RequestBody Task task, Authentication authentication) {

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found !"
            );
        }

        User user = optionalUser.get();

        // set the logged in user as the task's user
        task.setUser(user);

        // save the task
        taskRepository.save(task);

        // add activity
        String activityDescription = "Added a new task: " + task.getSubject();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        return ResponseEntity.ok("Task successfully created ! ");
    }

    // delete task by id
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @DeleteMapping("/{task_id}")
    public ResponseEntity<String> deleteTask(@PathVariable long task_id, Authentication authentication){

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found!"
            );
        }

        User user = optionalUser.get();
        Optional<Task> optionalTask = taskRepository.findById(task_id);
        if(optionalTask.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Task with ID : " + task_id + " not found !"
            );
        }
        Task task = optionalTask.get();

        String activityDescription = "Deleted a task with subject : " + task.getSubject();
        Activity activity = new Activity(activityDescription, new Date(), user);
        activityRepository.save(activity);

        taskRepository.delete(task);

        return ResponseEntity.ok("Task with ID " + task_id + " successfully deleted ! ");
    }

    // get all tasks for the logged-in user
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @GetMapping("/myTasks")
    public List<Task> myTasks(Authentication authentication){

        // extract the currently authenticated user's username from Authentication
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found !"
            );
        }

        User user = optionalUser.get();

        // return the user's tasks
        return new ArrayList<>(user.getTasks());
    }

    // update task
    @PreAuthorize("hasRole('MANAGER') OR hasRole('ADMIN')")
    @PutMapping("/{task_id}/edit-task")
    public ResponseEntity<String> updateTask(@PathVariable long task_id, @RequestBody Task theTask, Authentication authentication){

        Optional<Task> optionalTask = taskRepository.findById(task_id);
        if(optionalTask.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Task with ID : " + task_id + " not found !"
            );
        }
        Task updateTask = optionalTask.get();

        // Save the original values for comparison
        String originalSubject = updateTask.getSubject();
        String originalStatus = updateTask.getStatus();
        String originalDescription = updateTask.getDescription();
        String originalPriority = updateTask.getPriority();
        Date originalDueDate = updateTask.getDueDate();

        // update task
        updateTask.setSubject(theTask.getSubject());
        updateTask.setStatus(theTask.getStatus());
        updateTask.setDescription(theTask.getDescription());
        updateTask.setPriority(theTask.getPriority());
        updateTask.setDueDate(theTask.getDueDate());

        taskRepository.save(updateTask);

        // Check for changes and add activities accordingly
        addActivityForTaskUpdate(updateTask, originalSubject, originalStatus, originalDescription, originalPriority, originalDueDate, authentication);

        return ResponseEntity.ok("Task updated successfully !");
    }

    private void addActivityForTaskUpdate(Task updatedTask, String originalName, String originalStatus, String originalDescription, String originalPriority, Date originalDueDate, Authentication authentication) {
        String username = authentication.getName();
        List<String> activities = new ArrayList<>();

        // Compare values and add activities
        if (!updatedTask.getSubject().equals(originalName)) {
            activities.add("Updated task subject from " + originalName + " to " + updatedTask.getSubject() + ".");
        }

        if (!updatedTask.getStatus().equals(originalStatus)) {
            activities.add("Updated task status from " + originalStatus + " to " + updatedTask.getStatus() + ".");
        }

        if (!updatedTask.getDescription().equals(originalDescription)) {
            activities.add("Updated description for task with subject: " +  updatedTask.getSubject() + ".");
        }

        if (!updatedTask.getPriority().equals(originalPriority)) {
            activities.add("Updated task priority from " + originalPriority + " to " + updatedTask.getPriority() + ".");
        }

        if (!updatedTask.getDueDate().equals(originalDueDate)) {
            activities.add("Updated task due date from " + originalDueDate + " to " + updatedTask.getDueDate() + ".");
        }

        // Add the activities to the user's activity list
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            for (String activityDescription : activities) {
                Activity activity = new Activity(activityDescription, new Date(), user);
                activityRepository.save(activity);
            }
        }
    }
}
