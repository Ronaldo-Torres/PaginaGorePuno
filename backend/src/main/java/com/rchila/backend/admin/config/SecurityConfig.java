package com.rchila.backend.admin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;
import java.util.Collections;

@Configuration
public class SecurityConfig {

    private static final String HMAC_SHA_256 = "HmacSHA256";

    private final String jwtSecret;

    private final String frontendUrl;

    public SecurityConfig(
            @Value("${spring.security.oauth2.resourceserver.jwt.secret-key}") final String jwtSecret,
            @Value("${app.url.frontend}") final String frontendUrl) {
        this.jwtSecret = jwtSecret;
        this.frontendUrl = frontendUrl;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(final HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/v1/auth/**",
                                "/error",
                                "/actuator/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v1/email/send",
                                "/v1/test/email/send",
                                "/v1/account/**",
                                "/uploads/**",
                                "/public/**",
                                "/v1/documentos/tipo/**"
                                )
                        .permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer((oauth2) -> oauth2.jwt(Customizer.withDefaults()))
                .csrf(csrf -> csrf.ignoringRequestMatchers(
                        "/v1/auth/**", 
                        "swagger-ui/**", 
                        "/v1/email/send",
                        "/v1/test/email/send",
                        "/v1/account/**",
                        "/uploads/**",
                        "/public/**",
                        "/v1/documentos/tipo/**"
                        ));

        final CorsConfigurationSource corsConfigurationSource = corsConfigurationSource(
                frontendUrl
                //"https://consejo.regionpuno.gob.pe"
        );
        http.cors(cors -> cors.configurationSource(corsConfigurationSource));

        return http.build();
    }

    private CorsConfigurationSource corsConfigurationSource(final String origin) {
        final var configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList(origin));
        configuration.setAllowedMethods(Collections.singletonList(CorsConfiguration.ALL));
        configuration.setAllowedHeaders(Collections.singletonList(CorsConfiguration.ALL));
        configuration.setAllowCredentials(true);

        final var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withSecretKey(new SecretKeySpec(jwtSecret.getBytes(), HMAC_SHA_256)).build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(final AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
