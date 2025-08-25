package vn.student.webbangiay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.student.webbangiay.model.Voucher;
import vn.student.webbangiay.service.VoucherService;

import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin(origins = "*")
public class CustomerVoucherController {

    @Autowired
    private VoucherService voucherService;

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

    // Áp dụng voucher (sẽ được gọi từ order processing)
    @PostMapping("/apply")
    public ResponseEntity<String> applyVoucherToOrder(
            @RequestParam String code,
            @RequestParam Integer customerId,
            @RequestParam String orderId) {
        try {
            voucherService.applyVoucher(code, customerId, orderId);
            return ResponseEntity.ok("Voucher đã được áp dụng thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
