package vn.student.webbangiay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.student.webbangiay.model.VoucherUsage;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VoucherUsageRepository extends JpaRepository<VoucherUsage, Long> {
    
    // Lấy lịch sử sử dụng voucher của customer
    @Query("SELECT vu FROM VoucherUsage vu " +
           "WHERE vu.customer.customerId = :customerId " +
           "ORDER BY vu.usedAt DESC")
    List<VoucherUsage> findByCustomerIdOrderByUsedAtDesc(@Param("customerId") Long customerId);
    
    // Lấy lịch sử sử dụng của voucher
    @Query("SELECT vu FROM VoucherUsage vu " +
           "WHERE vu.voucher.voucherId = :voucherId " +
           "ORDER BY vu.usedAt DESC")
    List<VoucherUsage> findByVoucherIdOrderByUsedAtDesc(@Param("voucherId") Long voucherId);
    
    // Tổng số tiền đã giảm giá bởi một voucher
    @Query("SELECT SUM(vu.discountAmount) FROM VoucherUsage vu " +
           "WHERE vu.voucher.voucherId = :voucherId")
    Double getTotalDiscountByVoucher(@Param("voucherId") Long voucherId);
    
    // Thống kê sử dụng voucher trong khoảng thời gian
    @Query("SELECT vu FROM VoucherUsage vu " +
           "WHERE vu.usedAt BETWEEN :startDate AND :endDate " +
           "ORDER BY vu.usedAt DESC")
    List<VoucherUsage> findByUsedAtBetween(@Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);
}
