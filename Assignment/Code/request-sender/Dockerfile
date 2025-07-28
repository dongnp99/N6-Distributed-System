# Sử dụng image JDK nhỏ, nhẹ
FROM eclipse-temurin:17-jdk-alpine

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Copy file JAR đã build từ thư mục target vào container
COPY target/*.jar app.jar

# Câu lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
