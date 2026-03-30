package com.mosilshop.dto;
import org.springframework.data.jpa.repository.JpaRepository;
import com.mosilshop.entity.User;
import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class AuthResponseDTO {
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private String role;

    public static AuthResponseDTO of(String token, User user) {
        AuthResponseDTO r = new AuthResponseDTO();
        r.token = token;
        r.email = user.getEmail();
        r.firstName = user.getFirstName();
        r.lastName = user.getLastName();
        r.role = user.getRole().name();
        return r;
    }
}

