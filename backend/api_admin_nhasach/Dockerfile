# Stage 1: Build với Maven và Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml và tải dependencies trước để tận dụng cache của Docker
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy toàn bộ code và build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Chạy ứng dụng với JRE 21 nhẹ hơn
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy file jar từ stage build (tên file dựa theo artifactId trong pom.xml)
COPY --from=build /app/target/api-0.0.1-SNAPSHOT.jar app.jar

# Port mặc định của Spring Boot
EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]