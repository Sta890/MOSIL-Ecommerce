package com.mosilshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MosilBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(MosilBackendApplication.class, args);
    }
}
