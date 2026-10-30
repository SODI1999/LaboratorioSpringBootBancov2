package com.udea.banco.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 3.0 specification configuration for Swagger UI.
 */
@Configuration
public class OpenApiConfig {

    /**
     * Configures metadata for the API documentation.
     *
     * @return custom OpenAPI configuration
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Laboratorio Spring Boot Banco API")
                        .version("1.0.0")
                        .description("API REST para el traslado de dinero entre cuentas bancarias, histórico de transacciones y generación de comprobantes con código QR. Tecnológico de Antioquia 2026.")
                        .contact(new Contact()
                                .name("Tecnológico de Antioquia - Diseño de Sistemas")
                                .url("https://www.tdea.edu.co")));
    }
}
