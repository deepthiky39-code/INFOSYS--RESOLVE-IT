package com.grievance.config;

import com.grievance.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig
    ) throws Exception {
        return authConfig.getAuthenticationManager();
    }

@Bean
public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {

    org.springframework.web.cors.CorsConfiguration config =
            new org.springframework.web.cors.CorsConfiguration();

    config.setAllowedOrigins(
            java.util.List.of(
                "https://infosys-resolve-it.vercel.app",          // your frontend
                "https://noble-adventure-production.up.railway.app" // backend
            )
    );

    config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(java.util.List.of("*"));
    config.setExposedHeaders(java.util.List.of("Authorization"));
    config.setAllowCredentials(true);

    org.springframework.web.cors.UrlBasedCorsConfigurationSource source =
            new org.springframework.web.cors.UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration("/**", config);
    return source;
}


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

                // ===== PUBLIC =====
                .requestMatchers("/auth/**", "/api/auth/**", "/error").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/complaints/photos/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ===== FEEDBACK (ADMIN FIRST 🔥) =====
                .requestMatchers(HttpMethod.GET, "/api/feedback/admin")
                    .hasAnyRole("ADMIN", "SENIOR_ADMIN")

                // ===== FEEDBACK (USER) =====
                .requestMatchers(HttpMethod.POST, "/api/feedback/**")
                    .hasRole("USER")

                // ===== COMPLAINTS =====
                .requestMatchers(HttpMethod.POST, "/api/complaints/**")
.hasAnyRole("USER", "ADMIN")



                .requestMatchers(HttpMethod.GET, "/api/complaints/**")
                    .authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/users/profile").hasRole("USER")
.requestMatchers(HttpMethod.PUT, "/api/users/profile")
.hasRole("USER")

                // ===== ADMIN MODULE =====
                .requestMatchers("/api/admin/**")
                    .hasAnyRole("ADMIN", "SENIOR_ADMIN")

                // ===== EVERYTHING ELSE =====
                .requestMatchers("/api/**").authenticated()
                .anyRequest().denyAll()
            )
            //.authenticationProvider(authenticationProvider)
            //.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
 .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
