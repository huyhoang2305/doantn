package vn.student.webbangiay.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestResponse {
    private Integer guestId;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String address2;
    private String city;
    private Date createdAt;
    private Date updatedAt;
}
