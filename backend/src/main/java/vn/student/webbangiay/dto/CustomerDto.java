package vn.student.webbangiay.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {

    @NotBlank(message = "Full name is mandatory")
    @Size(max = 50, message = "Full name must not exceed 50 characters")
    private String fullName;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String hashPassword;

    @NotBlank(message = "Phone number is mandatory")
    @Size(max = 15, message = "Phone number must not exceed 15 characters")
    private String phone;

    @NotBlank(message = "Address is mandatory")
    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;

    @Size(max = 255, message = "Address2 must not exceed 255 characters")
    private String address2;

    @NotBlank(message = "City is mandatory")
    @Size(max = 50, message = "City must not exceed 50 characters")
    private String city;
}
