FROM openjdk:11.0.8-jdk-slim-buster

## Generate Application folders.
RUN mkdir -p /app/config/ && mkdir -p /opt/migrations/

## Application executable
ADD devices-manager.jar /app/devices.manager.service.jar

## Default Configurations
ADD application.properties /app/config/application.properties
ADD migrations /opt/migrations

## Entrypoints.
ENTRYPOINT ["java", "-jar", "/app/devices.manager.service.jar", "--spring.config.location=/app/config/application.properties"]
