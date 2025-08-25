package vn.student.webbangiay.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {
    private Integer customerId;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String address2;
    private String city;
    private Boolean isActive;
}
