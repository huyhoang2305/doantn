package vn.student.webbangiay.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductColorImageDto {

    @NotNull(message = "Product color ID cannot be null")
    private Integer productColorId;

    @NotNull(message = "Image files cannot be null")
    private List<MultipartFile> imageFiles;  // Allows multiple images
}
