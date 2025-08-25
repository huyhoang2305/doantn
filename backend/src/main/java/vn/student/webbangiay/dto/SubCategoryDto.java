package vn.student.webbangiay.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.webbangiay.model.Gender;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubCategoryDto {

    @NotBlank(message = "Sub-category name is required")
    @Size(max = 50, message = "Sub-category name must not exceed 50 characters")
    private String subCategoryName;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Category ID is required")
    private Integer categoryId;  // Reference to the category

    private Boolean isActive = true;

}
