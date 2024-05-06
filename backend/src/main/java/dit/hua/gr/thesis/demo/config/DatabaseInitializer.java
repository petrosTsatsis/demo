package dit.hua.gr.thesis.demo.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

@Component
public class DatabaseInitializer {

    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;

    @Value("classpath:assets/database/data.sql")  // This should match the location of your data.sql file
    private String sqlScriptLocation;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate, ResourceLoader resourceLoader) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourceLoader = resourceLoader;
    }

    @PostConstruct
    public void initializeDatabase() throws IOException {
        Resource resource = resourceLoader.getResource(sqlScriptLocation);
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            String sqlScript = reader.lines().collect(Collectors.joining("\n"));
            jdbcTemplate.execute(sqlScript);
        }
    }
}