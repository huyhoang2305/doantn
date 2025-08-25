package vn.student.webbangiay.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.webbangiay.model.Role;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    
    private String adminUserId;
    private String email;
    private String fullName;
    private Role role;
    private Boolean isActive;
    private Date createdAt;
    private Date updatedAt;
}
