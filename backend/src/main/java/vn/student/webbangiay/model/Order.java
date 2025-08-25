package vn.student.webbangiay.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "`order`")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @Column(name = "order_id", length = 20, columnDefinition = "NVARCHAR(20)")
    private String orderId;

    @Column(name = "order_note", length = 1024, columnDefinition = "NVARCHAR(1024)")
    private String orderNote;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    @Column(name = "total_price", nullable = false)
    private long totalPrice;

    @Column(name = "is_paid", nullable = false)
    private Boolean isPaid;

    @Column(name = "paid_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date paidAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false, length = 20)
    private OrderStatus orderStatus;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "customer_id", nullable = true) 
    private Customer customer;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = true) 
    @JoinColumn(name = "guest_id", nullable = true)
    private Guest guest;
    
}
