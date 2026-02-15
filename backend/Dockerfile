# ETAPA 1: Compilación (Build)
# Usamos una imagen que ya tiene Maven y el JDK instalados
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos solo el archivo de configuración de dependencias primero para aprovechar el caché de Docker
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código fuente y compilamos el proyecto saltándonos los tests para ir más rápido
COPY src ./src
RUN mvn clean package -DskipTests

# ETAPA 2: Imagen de ejecución (Run)
# Usamos la imagen ligera que ya tenías
FROM eclipse-temurin:17-jdk
WORKDIR /app

# El truco: Copiamos el .jar generado en la etapa anterior (build)
# La carpeta target/ existe dentro del contenedor 'build', no en tu servidor
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Ejecutamos la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]

