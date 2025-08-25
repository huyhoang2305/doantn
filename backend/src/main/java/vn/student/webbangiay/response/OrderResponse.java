package vn.student.webbangiay.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.webbangiay.dto.OrderDto;
import vn.student.webbangiay.model.OrderStatus;
import vn.student.webbangiay.model.PaymentMethod;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private String orderId; // Unique identifier for the order
    private String orderNote; // Optional note from the customer
    private PaymentMethod paymentMethod; // Payment method used
    private long totalPrice; // Total amount for the order
    private boolean isPaid; // Payment status
    private OrderStatus orderStatus; // Current status of the order
    private OrderDto orderDetails; // Nested object containing basic order details

    // Guest information (nullable)
    private String guestName; // Name of the guest user
    private String guestEmail; // Email of the guest user
    private String guestPhone; // Phone number of the guest user

    // Customer information (nullable)
    private String customerName; // Name of the customer
    private String customerEmail; // Email of the customer
    private String customerPhone; // Phone number of the customer
}
