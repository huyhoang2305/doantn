package vn.student.webbangiay.model;

public enum OrderStatus {
    PENDING_PAYMENT,      // Order placed but payment is not yet completed
    PAYMENT_CONFIRMED,    // Payment has been confirmed
    PROCESSING,           // Order is being prepared/processed
    SHIPPED,              // Order has been shipped to the customer
    OUT_FOR_DELIVERY,     // Order is out for delivery
    DELIVERED,            // Order has been delivered to the customer
    CANCELED,             // Order has been canceled
    RETURN_REQUESTED,     // Customer has requested a return
    RETURNED,             // Order has been returned by the customer
    REFUNDED,             // Order has been refunded
    FAILED                // Payment or order processing failed
}
