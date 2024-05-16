FROM eclipse-temurin:17-jdk-alpine

RUN mkdir -p /app/config/

ADD query-manager.jar /app/query.manager.jar
ADD application.properties /app/config/application.properties

ENTRYPOINT ["java", "-jar", "/app/query.manager.jar", "--spring.config.location=/app/config/application.properties"]
