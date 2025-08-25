package vn.student.webbangiay.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.student.webbangiay.model.*;
import vn.student.webbangiay.repository.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherUsageRepository voucherUsageRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Lấy tất cả voucher
    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    // Lấy voucher theo ID
    public Optional<Voucher> getVoucherById(Long id) {
        return voucherRepository.findById(id);
    }

    // Tạo voucher mới
    public Voucher createVoucher(Voucher voucher) {
        voucher.setUsedCount(0);
        return voucherRepository.save(voucher);
    }

    // Cập nhật voucher
    public Voucher updateVoucher(Long id, Voucher voucherDetails) {
        return voucherRepository.findById(id)
                .map(voucher -> {
                    voucher.setCode(voucherDetails.getCode());
                    voucher.setName(voucherDetails.getName());
                    voucher.setDescription(voucherDetails.getDescription());
                    voucher.setDiscountType(voucherDetails.getDiscountType());
                    voucher.setDiscountValue(voucherDetails.getDiscountValue());
                    voucher.setMaxDiscount(voucherDetails.getMaxDiscount());
                    voucher.setMinOrderValue(voucherDetails.getMinOrderValue());
                    voucher.setConditionType(voucherDetails.getConditionType());
                    voucher.setConditionValue(voucherDetails.getConditionValue());
                    voucher.setStartDate(voucherDetails.getStartDate());
                    voucher.setEndDate(voucherDetails.getEndDate());
                    voucher.setUsageLimit(voucherDetails.getUsageLimit());
                    voucher.setIsActive(voucherDetails.getIsActive());
                    return voucherRepository.save(voucher);
                })
                .orElseThrow(() -> new RuntimeException("Voucher not found with id: " + id));
    }

    // Xóa voucher
    public void deleteVoucher(Long id) {
        voucherRepository.deleteById(id);
    }

    // Toggle trạng thái voucher
    public Voucher toggleVoucherStatus(Long id) {
        return voucherRepository.findById(id)
                .map(voucher -> {
                    voucher.setIsActive(!voucher.getIsActive());
                    return voucherRepository.save(voucher);
                })
                .orElseThrow(() -> new RuntimeException("Voucher not found with id: " + id));
    }

    // Lấy voucher có thể áp dụng cho customer
    public List<Voucher> getAvailableVouchersForCustomer(Integer customerId, Double orderValue) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Kiểm tra xem customer đã có đơn hàng nào chưa
        boolean hasOrders = orderRepository.existsByCustomer(customer);

        // Tính tổng giá trị đã mua
        Double totalPurchasedTemp = orderRepository.getTotalPurchasedByCustomer(customerId);
        final Double totalPurchased = (totalPurchasedTemp == null) ? 0.0 : totalPurchasedTemp;

        // Lấy voucher có thể áp dụng
        List<Voucher> allActiveVouchers = voucherRepository.findByIsActiveTrueOrderByVoucherIdDesc();
        
        return allActiveVouchers.stream()
                .filter(voucher -> isVoucherApplicable(voucher, customerId, hasOrders, totalPurchased, orderValue))
                .collect(Collectors.toList());
    }

    // Kiểm tra voucher có thể áp dụng không
    private boolean isVoucherApplicable(Voucher voucher, Integer customerId, boolean hasOrders, 
                                       Double totalPurchased, Double orderValue) {
        // Kiểm tra thời gian
        LocalDate now = LocalDate.now();
        if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate())) {
            return false;
        }

        // Kiểm tra usage limit
        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            return false;
        }

        // Kiểm tra min order value
        if (voucher.getMinOrderValue() != null && orderValue < voucher.getMinOrderValue()) {
            return false;
        }

        // Kiểm tra điều kiện cụ thể
        return checkVoucherCondition(voucher, hasOrders, totalPurchased, orderValue);
    }

    // Kiểm tra tính hợp lệ của voucher
    public VoucherValidationResult validateVoucher(String code, Integer customerId, Double orderValue) {
        Optional<Voucher> voucherOpt = voucherRepository.findByCodeAndIsActiveTrue(code);
        
        if (voucherOpt.isEmpty()) {
            return new VoucherValidationResult(false, "Mã voucher không tồn tại hoặc đã bị vô hiệu hóa", null);
        }

        Voucher voucher = voucherOpt.get();
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Kiểm tra các điều kiện
        if (!voucher.isValid()) {
            return new VoucherValidationResult(false, "Voucher đã hết hạn hoặc chưa đến thời gian sử dụng", null);
        }

        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            return new VoucherValidationResult(false, "Voucher đã hết lượt sử dụng", null);
        }

        if (voucher.getMinOrderValue() != null && orderValue < voucher.getMinOrderValue()) {
            return new VoucherValidationResult(false, 
                "Đơn hàng phải có giá trị tối thiểu " + voucher.getMinOrderValue() + " VND", null);
        }

        // Kiểm tra xem customer đã sử dụng voucher này chưa
        boolean hasUsed = voucherRepository.hasCustomerUsedVoucher(voucher.getVoucherId(), Long.valueOf(customerId));
        if (hasUsed) {
            return new VoucherValidationResult(false, "Bạn đã sử dụng voucher này rồi", null);
        }

        // Kiểm tra điều kiện cụ thể
        boolean hasOrders = orderRepository.existsByCustomer(customer);
        Double totalPurchased = orderRepository.getTotalPurchasedByCustomer(customerId);
        if (totalPurchased == null) totalPurchased = 0.0;

        boolean conditionMet = checkVoucherCondition(voucher, hasOrders, totalPurchased, orderValue);
        if (!conditionMet) {
            String message = getConditionNotMetMessage(voucher);
            return new VoucherValidationResult(false, message, null);
        }

        // Tính toán giảm giá
        Double discountAmount = calculateDiscount(voucher, orderValue);
        
        return new VoucherValidationResult(true, "Voucher hợp lệ", discountAmount);
    }

    // Áp dụng voucher cho đơn hàng
    @Transactional
    public VoucherUsage applyVoucher(String code, Integer customerId, String orderId) {
        Optional<Voucher> voucherOpt = voucherRepository.findByCodeAndIsActiveTrue(code);
        
        if (voucherOpt.isEmpty()) {
            throw new RuntimeException("Mã voucher không tồn tại hoặc đã bị vô hiệu hóa");
        }

        Voucher voucher = voucherOpt.get();
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Validate voucher trước khi áp dụng
        VoucherValidationResult validation = validateVoucher(code, customerId, (double) order.getTotalPrice());
        if (!validation.isValid()) {
            throw new RuntimeException(validation.getMessage());
        }

        // Tạo record sử dụng voucher
        VoucherUsage voucherUsage = new VoucherUsage(voucher, customer, order, validation.getDiscountAmount());
        voucherUsageRepository.save(voucherUsage);

        // Cập nhật số lần sử dụng voucher
        voucher.incrementUsedCount();
        voucherRepository.save(voucher);

        return voucherUsage;
    }

    // Tính toán giảm giá
    private Double calculateDiscount(Voucher voucher, Double orderValue) {
        double discount = 0.0;
        
        if (voucher.getDiscountType() == Voucher.DiscountType.PERCENTAGE) {
            discount = orderValue * (voucher.getDiscountValue() / 100.0);
            // Áp dụng giới hạn giảm giá tối đa nếu có
            if (voucher.getMaxDiscount() != null && discount > voucher.getMaxDiscount()) {
                discount = voucher.getMaxDiscount();
            }
        } else {
            discount = voucher.getDiscountValue();
            // Giảm giá cố định không được vượt quá giá trị đơn hàng
            if (discount > orderValue) {
                discount = orderValue;
            }
        }
        
        return discount;
    }

    // Kiểm tra điều kiện voucher
    private boolean checkVoucherCondition(Voucher voucher, boolean hasOrders, Double totalPurchased, Double orderValue) {
        switch (voucher.getConditionType()) {
            case ALL_CUSTOMERS:
                return true;
                
            case FIRST_ORDER:
                return !hasOrders;
                
            case TOTAL_PURCHASED:
                return totalPurchased >= voucher.getConditionValue();
                
            case ORDER_VALUE:
                return orderValue >= voucher.getConditionValue();
                
            case SPECIFIC_DATE:
                // Kiểm tra xem có phải ngày cụ thể không (có thể mở rộng để so sánh với conditionValue)
                return true; // Tạm thời return true, có thể customize sau
                
            default:
                return false;
        }
    }

    // Lấy thông báo khi không đáp ứng điều kiện
    private String getConditionNotMetMessage(Voucher voucher) {
        switch (voucher.getConditionType()) {
            case FIRST_ORDER:
                return "Voucher này chỉ dành cho khách hàng mua lần đầu";
                
            case TOTAL_PURCHASED:
                return "Bạn cần mua tổng cộng tối thiểu " + voucher.getConditionValue() + " VND để sử dụng voucher này";
                
            case ORDER_VALUE:
                return "Đơn hàng phải có giá trị tối thiểu " + voucher.getConditionValue() + " VND";
                
            case SPECIFIC_DATE:
                return "Voucher này chỉ có thể sử dụng vào ngày cụ thể";
                
            default:
                return "Không đáp ứng điều kiện sử dụng voucher";
        }
    }

    // Lấy lịch sử sử dụng voucher của customer
    public List<VoucherUsage> getCustomerVoucherHistory(Long customerId) {
        return voucherUsageRepository.findByCustomerIdOrderByUsedAtDesc(customerId);
    }

    // Lấy thống kê sử dụng voucher
    public List<VoucherUsage> getVoucherUsageHistory(Long voucherId) {
        return voucherUsageRepository.findByVoucherIdOrderByUsedAtDesc(voucherId);
    }

    // Inner class cho kết quả validation
    public static class VoucherValidationResult {
        private boolean valid;
        private String message;
        private Double discountAmount;

        public VoucherValidationResult(boolean valid, String message, Double discountAmount) {
            this.valid = valid;
            this.message = message;
            this.discountAmount = discountAmount;
        }

        // Getters
        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public Double getDiscountAmount() { return discountAmount; }
    }
}
