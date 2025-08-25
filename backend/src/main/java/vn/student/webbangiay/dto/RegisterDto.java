package vn.student.webbangiay.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String address2;
    private String city;
}