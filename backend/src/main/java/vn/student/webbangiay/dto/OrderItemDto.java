package vn.student.webbangiay.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    private Integer productSizeId; // ID of the product size
    private Integer quantity; // Quantity of the product ordered
    private Long price; // Price per unit of the product
}
