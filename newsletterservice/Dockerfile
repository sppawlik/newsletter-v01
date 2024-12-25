FROM eclipse-temurin:23-alpine
VOLUME /tmp
ARG JAR_FILE=target/libs
COPY ${JAR_FILE}/BOOT-INF/lib /app/lib
COPY ${JAR_FILE}/META-INF /app/META-INF
COPY ${JAR_FILE}/BOOT-INF/classes /app
EXPOSE 8080
RUN ls -R /app
ENTRYPOINT ["java", "-cp", "app:app/lib/*", "com.creoscope.newsletter.newsletterservice.NewsletterServiceApplication"]
