package vn.student.webbangiay.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {

    @NotBlank(message = "Product name cannot be blank")
    private String productName;

    @NotNull(message = "Original price cannot be null")
    @Min(value = 0, message = "Original price must be at least 0")
    private Long originalPrice;

    @NotNull(message = "Unit price cannot be null")
    @Min(value = 0, message = "Unit price must be at least 0")
    private Long unitPrice;

    @NotNull(message = "Unit price cannot be null")
    private int brandId;

    @NotNull(message = "Unit price cannot be null")
    private int subCategoryId;

    private Boolean isActive = true;
}
