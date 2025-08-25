package vn.student.webbangiay.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDto {
    private int customerId; 
    private GuestDto guestDto;
    private OrderDto orderDto; 
    private List<OrderItemDto> orderItemDtos; 
}
