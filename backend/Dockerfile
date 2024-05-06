FROM openjdk:17 as buildstage
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline
COPY src src
RUN ./mvnw package -Dmaven.test.skip=true
RUN mv target/*.jar demo.jar

FROM openjdk:17
COPY --from=buildstage /app/demo.jar .
ENTRYPOINT ["java", "-jar", "demo.jar"]
