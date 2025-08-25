package vn.student.webbangiay.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleDto {
    
    @NotBlank(message = "Role ID is mandatory")
    @Size(max = 36, message = "Role ID must not exceed 36 characters")
    private String roleId;

    @NotBlank(message = "Role name is mandatory")
    @Size(max = 30, message = "Role name must not exceed 30 characters")
    private String roleName;

    @Size(max = 128, message = "Description must not exceed 128 characters")
    private String description;

    private Date createdAt;
    private Date updatedAt;
}
