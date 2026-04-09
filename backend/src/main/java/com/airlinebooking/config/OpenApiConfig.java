package com.airlinebooking.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Airline Booking System API",
        version = "1.0.0",
        description = "Production-grade airline booking system with tiered benefits",
        contact = @Contact(
            name = "Travel Agency",
            email = "support@airlinebooking.com"
        ),
        license = @License(
            name = "Apache 2.0",
            url = "https://www.apache.org/licenses/LICENSE-2.0.html"
        )
    ),
    servers = {
        @Server(
            url = "http://localhost:3001",
            description = "Local Development Server"
        ),
        @Server(
            url = "https://api.airlinebooking.com",
            description = "Production Server"
        )
    }
)
public class OpenApiConfig {
}
