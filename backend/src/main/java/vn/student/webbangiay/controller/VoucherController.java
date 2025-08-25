package vn.student.webbangiay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.student.webbangiay.model.Voucher;
import vn.student.webbangiay.model.VoucherUsage;
import vn.student.webbangiay.service.VoucherService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/vouchers")
@CrossOrigin(origins = "*")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    // Lấy tất cả voucher
    @GetMapping
    public ResponseEntity<List<Voucher>> getAllVouchers() {
        List<Voucher> vouchers = voucherService.getAllVouchers();
        return ResponseEntity.ok(vouchers);
    }

    // Lấy voucher theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Voucher> getVoucherById(@PathVariable Long id) {
        Optional<Voucher> voucher = voucherService.getVoucherById(id);
        return voucher.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // Tạo voucher mới
    @PostMapping
    public ResponseEntity<Voucher> createVoucher(@RequestBody Voucher voucher) {
        try {
            Voucher createdVoucher = voucherService.createVoucher(voucher);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdVoucher);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật voucher
    @PutMapping("/{id}")
    public ResponseEntity<Voucher> updateVoucher(@PathVariable Long id, @RequestBody Voucher voucher) {
        try {
            Voucher updatedVoucher = voucherService.updateVoucher(id, voucher);
            return ResponseEntity.ok(updatedVoucher);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Xóa voucher
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoucher(@PathVariable Long id) {
        try {
            voucherService.deleteVoucher(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Toggle trạng thái voucher
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Voucher> toggleVoucherStatus(@PathVariable Long id) {
        try {
            Voucher voucher = voucherService.toggleVoucherStatus(id);
            return ResponseEntity.ok(voucher);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Lấy voucher có thể áp dụng cho customer
    @GetMapping("/available")
    public ResponseEntity<List<Voucher>> getAvailableVouchers(
            @RequestParam Integer customerId,
            @RequestParam Double orderValue) {
        try {
            List<Voucher> availableVouchers = voucherService.getAvailableVouchersForCustomer(customerId, orderValue);
            return ResponseEntity.ok(availableVouchers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Validate voucher
    @PostMapping("/validate")
    public ResponseEntity<VoucherService.VoucherValidationResult> validateVoucher(
            @RequestParam String code,
            @RequestParam Integer customerId,
            @RequestParam Double orderValue) {
        try {
            VoucherService.VoucherValidationResult result = voucherService.validateVoucher(code, customerId, orderValue);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new VoucherService.VoucherValidationResult(false, "Lỗi kiểm tra voucher", null));
        }
    }

    // Áp dụng voucher
    @PostMapping("/apply")
    public ResponseEntity<VoucherUsage> applyVoucher(
            @RequestParam String code,
            @RequestParam Integer customerId,
            @RequestParam String orderId) {
        try {
            VoucherUsage voucherUsage = voucherService.applyVoucher(code, customerId, orderId);
            return ResponseEntity.ok(voucherUsage);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Lấy lịch sử sử dụng voucher của customer
    @GetMapping("/history/customer/{customerId}")
    public ResponseEntity<List<VoucherUsage>> getCustomerVoucherHistory(@PathVariable Long customerId) {
        try {
            List<VoucherUsage> history = voucherService.getCustomerVoucherHistory(customerId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Lấy thống kê sử dụng voucher
    @GetMapping("/{id}/usage-history")
    public ResponseEntity<List<VoucherUsage>> getVoucherUsageHistory(@PathVariable Long id) {
        try {
            List<VoucherUsage> history = voucherService.getVoucherUsageHistory(id);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
