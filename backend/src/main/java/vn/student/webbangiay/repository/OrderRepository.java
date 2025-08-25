package vn.student.webbangiay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.student.webbangiay.model.Order;
import vn.student.webbangiay.model.Customer;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    // Find orders by date (year, month, day)
    @Query("SELECT o FROM Order o WHERE YEAR(o.createdAt) = :year AND MONTH(o.createdAt) = :month AND DAY(o.createdAt) = :day")
    List<Order> findOrdersByDate(int year, int month, int day);

    // Count orders by date
    @Query("SELECT COUNT(o) FROM Order o WHERE YEAR(o.createdAt) = :year AND MONTH(o.createdAt) = :month AND DAY(o.createdAt) = :day")
    long countOrdersByDate(int year, int month, int day);

    // Find orders by month (year, month)
    @Query("SELECT o FROM Order o WHERE YEAR(o.createdAt) = :year AND MONTH(o.createdAt) = :month")
    List<Order> findOrdersByMonth(int year, int month);

    // Count orders by month
    @Query("SELECT COUNT(o) FROM Order o WHERE YEAR(o.createdAt) = :year AND MONTH(o.createdAt) = :month")
    long countOrdersByMonth(int year, int month);

    // Find orders by year
    @Query("SELECT o FROM Order o WHERE YEAR(o.createdAt) = :year")
    List<Order> findOrdersByYear(int year);

    // Count orders by year
    @Query("SELECT COUNT(o) FROM Order o WHERE YEAR(o.createdAt) = :year")
    long countOrdersByYear(int year);
    
    // Count orders by customer
    long countByCustomerCustomerId(Integer customerId);
    
    // Check if customer has any orders
    boolean existsByCustomer(Customer customer);
    
    // Get total purchased amount by customer
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.customer.customerId = :customerId")
    Double getTotalPurchasedByCustomer(@Param("customerId") Integer customerId);
}
