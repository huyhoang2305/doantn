package vn.student.webbangiay.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response class for product color images.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductColorImageResponse {
    private Integer productColorImageId;
    private String imageUrl;
    private Integer productColorId; // Optionally include product color ID for reference
}
