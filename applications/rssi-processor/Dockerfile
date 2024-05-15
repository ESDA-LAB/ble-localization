FROM openjdk:11.0.8-jdk-slim-buster

RUN mkdir -p /app/config
RUN mkdir -p /app/train

ADD rssi-processor.jar /app/rssi.processor.jar
ADD application.properties /app/config/application.properties
ADD models/model.arff /app/train/model.arff

ENTRYPOINT ["java", "-jar", "/app/rssi.processor.jar", "--spring.config.location=/app/config/application.properties"]
