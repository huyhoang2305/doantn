package vn.student.webbangiay.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileDto {
    
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 50, message = "Full name must have between 2 and 50 characters")
    private String fullName;
}
