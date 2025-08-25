package vn.student.webbangiay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.student.webbangiay.model.Voucher;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    
    // Tìm voucher theo code
    Optional<Voucher> findByCodeAndIsActiveTrue(String code);
    
    // Lấy tất cả voucher đang hoạt động (sort bằng ID vì không có createdAt)
    List<Voucher> findByIsActiveTrueOrderByVoucherIdDesc();
    
    // Kiểm tra customer đã sử dụng voucher này chưa
    @Query("SELECT COUNT(vu) > 0 FROM VoucherUsage vu " +
           "WHERE vu.voucher.voucherId = :voucherId " +
           "AND vu.customer.customerId = :customerId")
    boolean hasCustomerUsedVoucher(@Param("voucherId") Long voucherId, 
                                   @Param("customerId") Long customerId);
    
    // Đếm số lần customer đã sử dụng voucher này
    @Query("SELECT COUNT(vu) FROM VoucherUsage vu " +
           "WHERE vu.voucher.voucherId = :voucherId " +
           "AND vu.customer.customerId = :customerId")
    long countVoucherUsageByCustomer(@Param("voucherId") Long voucherId, 
                                     @Param("customerId") Long customerId);
    
    // Lấy voucher đã hết hạn
    @Query("SELECT v FROM Voucher v WHERE v.endDate < :currentDate")
    List<Voucher> findExpiredVouchers(@Param("currentDate") LocalDate currentDate);
    
    // Lấy voucher sắp hết hạn (trong vòng x ngày)
    @Query("SELECT v FROM Voucher v WHERE v.isActive = true " +
           "AND v.endDate BETWEEN :currentDate AND :expiringSoon")
    List<Voucher> findExpiringSoonVouchers(@Param("currentDate") LocalDate currentDate,
                                          @Param("expiringSoon") LocalDate expiringSoon);
}
