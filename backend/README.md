# JWT Spring Boot

Este proyecto es una aplicación Spring Boot que implementa autenticación y autorización usando JWT (JSON Web Tokens).

## Requisitos Previos

- Java 21
- Maven 3.9.5 o superior
- PostgreSQL 15 o superior
- Docker (opcional)

## Documentación

Echa un vistazo a la documentación más detallada en [https://jwt-spring-boot.programandoenjava.com/docs](https://jwt-spring-boot.programandoenjava.com/docs).

## Configuración del Entorno

1. Crea una copia del archivo `.env.example` y renómbralo a `.env.local`:

```bash
cp .env.example .env
```

2. Modifica las variables en el archivo `.env.local` según tu entorno:

```properties
# Configuración de la base de datos
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/jwt-spring-boot
SPRING_DATASOURCE_USERNAME=myuser
SPRING_DATASOURCE_PASSWORD=secret

# Configuración de JWT
JWT_SECRET=tu_clave_secreta
JWT_EXPIRATION_MS=3600000

# Configuración de Spring Boot
PROFILE=dev
PORT=8080
```

> **Nota**: Asegúrate de generar una clave secreta segura para JWT_SECRET en formato Base64.

## Construcción y Ejecución

### Usando Maven

```bash
# Compilar el proyecto
./mvnw clean package

# Ejecutar la aplicación
./mvnw spring-boot:run
```

### Usando Docker

El proyecto incluye dos Dockerfiles para diferentes escenarios de despliegue:

#### Dockerfile Estándar (JVM)

Este Dockerfile construye y ejecuta la aplicación en una JVM:

```bash
# Construir la imagen
docker build -t jwt-spring-boot .

# Ejecutar el contenedor
docker run -p 8080:8080 --env-file .env jwt-spring-boot
```

Características:
- Usa Eclipse Temurin JDK 21 para la construcción
- Usa Eclipse Temurin JRE 21 Alpine para la ejecución
- Tamaño de imagen más grande pero mejor para desarrollo
- Tiempo de inicio más lento pero con optimizaciones JIT

#### Dockerfile Nativo (GraalVM)

Este Dockerfile construye una imagen nativa de la aplicación:

```bash
# Construir la imagen
docker build -t jwt-spring-boot-native -f Dockerfile.native .

# Ejecutar el contenedor
docker run -p 8080:8080 --env-file .env jwt-spring-boot-native
```

Características:
- Usa GraalVM para compilación nativa
- Imagen base mínima (debian-slim)
- Tamaño de imagen más pequeño
- Tiempo de inicio más rápido
- Menor consumo de memoria

### Usando Docker Compose

También puedes usar Docker Compose para ejecutar la aplicación junto con PostgreSQL:

```bash
# Iniciar todos los servicios
docker-compose up -d

# Detener todos los servicios
docker-compose down
```

## Endpoints de la API

### Autenticación

- `POST /v1/auth/signup`: Registro de nuevo usuario
- `POST /v1/auth/login`: Inicio de sesión
- `POST /v1/auth/refresh`: Refrescar token de acceso

### Usuarios

- `GET /v1/users/me`: Obtener información del usuario actual
- `PUT /v1/users/me`: Actualizar información del usuario
- `DELETE /v1/users/me`: Eliminar cuenta de usuario

## Seguridad

La aplicación implementa las siguientes medidas de seguridad:

- Autenticación basada en JWT
- Contraseñas hasheadas con BCrypt
- Protección CSRF
- Configuración CORS
- Validación de entrada
- Manejo de errores seguro

## Licencia

Este software ha sido adquirido bajo una licencia de uso restringida. Copyright (c) 2025 Programando en Java.

**AVISO IMPORTANTE**: Este software es confidencial y su uso está limitado exclusivamente al licenciatario. Queda estrictamente prohibida cualquier forma de distribución, compartición o transferencia del software a terceros. La violación de estos términos resultará en la terminación inmediata de la licencia y posibles acciones legales.

Para consultas sobre su licencia, contacte a contacto@programandoenjava.com

Consulte el archivo [LICENSE](LICENSE) para ver los términos completos de la licencia.