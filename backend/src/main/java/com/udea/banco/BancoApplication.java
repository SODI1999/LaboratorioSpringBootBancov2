package com.udea.banco;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Banco Spring Boot Application.
 */
@SpringBootApplication
public class BancoApplication {

    /**
     * Application entry point.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(BancoApplication.class, args);
    }
}
