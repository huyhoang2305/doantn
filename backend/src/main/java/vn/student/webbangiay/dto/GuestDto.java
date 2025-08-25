package vn.student.webbangiay.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestDto {
    private String fullName; 
    private String email; 
    private String phone;
    private String address; 
    private String address2; 
    private String city;
}
