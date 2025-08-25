package vn.student.webbangiay.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSizeDto {

    @NotBlank(message = "Size value is required")
    @Size(max = 30, message = "Size value must not exceed 30 characters")
    private String sizeValue;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be greater than or equal to 0")
    private Integer stockQuantity;

    @NotNull(message = "Product color ID is required")
    private Integer productColorId; // Associated product color ID

    private Boolean isActive = true;
}
