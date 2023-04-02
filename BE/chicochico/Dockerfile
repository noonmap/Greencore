FROM adoptopenjdk/openjdk11 AS builder
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
# COPY /var/conf/env.properties src/main/resources/properties/
RUN chmod +x ./gradlew
RUN ./gradlew bootJAR

# docker build --build-arg SPRING_PROFILES_ACTIVE=dev .
# ARG SPRING_PROFILES_ACTIVE
# RUN echo $SPRING_PROFILES_ACTIVE
# ENV SPRING_PROFILES_ACTIVE=$SPRING_PROFILES_ACTIVE

FROM adoptopenjdk/openjdk11
COPY --from=builder build/libs/*.jar app.jar
EXPOSE 5000
ENTRYPOINT ["java", "-jar", "/app.jar"]