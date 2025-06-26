# Multi-stage build para otimizar o tamanho da imagem final
FROM eclipse-temurin:17-jdk-alpine as build

# Instalar Maven
RUN apk add --no-cache maven

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração do Maven primeiro (para cache de dependências)
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# Baixar dependências (aproveitando cache do Docker)
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Compilar aplicação
RUN mvn clean package -DskipTests

# Segunda etapa: runtime
FROM eclipse-temurin:17-jre-alpine

# Criar usuário não-root para segurança
RUN addgroup -S spring && adduser -S spring -G spring

# Definir diretório de trabalho
WORKDIR /app

# Copiar o JAR da aplicação do estágio de build
COPY --from=build /app/target/reconnect-*.jar app.jar

# Alterar proprietário dos arquivos para o usuário spring
RUN chown -R spring:spring /app

# Mudar para usuário não-root
USER spring

# Expor porta da aplicação (Spring Boot padrão)
EXPOSE 8080

# Configurar JVM para otimização em container
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Definir ponto de entrada
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
