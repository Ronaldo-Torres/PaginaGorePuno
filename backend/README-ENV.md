# Configuración de Variables de Entorno

Para ejecutar correctamente la aplicación, necesitas configurar las siguientes variables de entorno en un archivo `.env.local` en la carpeta raíz del backend.

## Variables Requeridas

```properties
# Base de datos
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/tubasededatos
SPRING_DATASOURCE_USERNAME=usuario
SPRING_DATASOURCE_PASSWORD=contraseña

# JWT
JWT_SECRET=tuclavemuysecreta
JWT_EXPIRATION_MS=3600000
JWT_REFRESH_EXPIRATION_MS=86400000

# Configuración de servidor
PORT=8080
PROFILE=dev

# URLs
FRONTEND_URL=http://localhost:3000

# Configuración de correo electrónico
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_contraseña_de_aplicacion

# URLs para emails
EMAIL_FROM=no-reply@sistemabas.com
ACTIVATION_URL=/auth/activate
RESET_PASSWORD_URL=/auth/reset-password
```

## Notas Importantes

- Para Gmail, `MAIL_PASSWORD` debe ser una "Contraseña de aplicación", no tu contraseña regular.
- Para generar una contraseña de aplicación en Gmail:
  1. Ve a tu cuenta de Google
  2. Selecciona "Seguridad"
  3. En "Acceso a Google", selecciona "Verificación en 2 pasos"
  4. En la parte inferior, selecciona "Contraseñas de aplicaciones"
  5. Genera una nueva contraseña para tu aplicación

- El valor de `JWT_SECRET` debe ser una cadena segura y aleatoria.
- Las URLs `ACTIVATION_URL` y `RESET_PASSWORD_URL` deben coincidir con las rutas en el frontend. 