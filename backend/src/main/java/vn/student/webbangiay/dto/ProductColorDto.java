package vn.student.webbangiay.dto;

import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductColorDto {

    @NotBlank(message = "Color name is required")
    @Size(max = 30, message = "Color name must not exceed 30 characters")
    private String colorName;

    private MultipartFile imageFile; // File upload for the image

    private Integer productId; // The associated product ID

    private Boolean isActive = true;
}
