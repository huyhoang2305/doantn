package vn.student.webbangiay.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import vn.student.webbangiay.model.Order;
import vn.student.webbangiay.model.OrderItem;

@Repository  
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    // Existing method to find OrderItems by Order
    List<OrderItem> findByOrder(Order order);

    @Query("SELECT oi.productSize.productColor.product.productName, SUM(oi.quantity) " +
           "FROM OrderItem oi " +
           "JOIN oi.productSize ps " +
           "JOIN ps.productColor pc " +
           "JOIN pc.product p " +
           "GROUP BY p.productName " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findBestSellingProducts();

}
