package vn.student.webbangiay.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long totalPrice; // Total price of the order
    private boolean isPaid; // Payment status
    private String orderNote;
}
