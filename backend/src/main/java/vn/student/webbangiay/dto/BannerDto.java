package vn.student.webbangiay.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BannerDto {

    @NotEmpty(message = "Title cannot be empty")
    @Size(max = 50, message = "Title cannot exceed 50 characters")
    private String title;

    @Size(max = 512, message = "Link cannot exceed 512 characters")
    private String link;

    @NotNull(message = "Visibility status cannot be null")
    private Boolean isActive;

    private MultipartFile imageFile;
}
