FROM openjdk:17 as buildstage
WORKDIR /app

# Copy files and convert text files from DOS to Unix format using sed
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Convert text files from DOS to Unix format using sed
RUN sed -i 's/\r$//' mvnw
RUN sed -i 's/\r$//' pom.xml
RUN for file in $(find src -type f -name "*.java"); do sed -i 's/\r$//' "$file"; done

# Continue with your build process
RUN ./mvnw dependency:go-offline
RUN ./mvnw package -Dmaven.test.skip=true
RUN mv target/*.jar demo.jar

FROM openjdk:17
COPY --from=buildstage /app/demo.jar .
ENTRYPOINT ["java", "-jar", "demo.jar"]
