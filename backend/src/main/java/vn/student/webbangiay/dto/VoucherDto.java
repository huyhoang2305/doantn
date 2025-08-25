package vn.student.webbangiay.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.webbangiay.model.Voucher;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherDto {
    private Long voucherId;
    private String code;
    private String name;
    private String description;
    private Voucher.DiscountType discountType;
    private Double discountValue;
    private Double maxDiscount;
    private Double minOrderValue;
    private Voucher.ConditionType conditionType;
    private Double conditionValue;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer usageLimit;
    private Integer usedCount;
    private Boolean isActive;

    // Constructor từ entity
    public VoucherDto(Voucher voucher) {
        this.voucherId = voucher.getVoucherId();
        this.code = voucher.getCode();
        this.name = voucher.getName();
        this.description = voucher.getDescription();
        this.discountType = voucher.getDiscountType();
        this.discountValue = voucher.getDiscountValue();
        this.maxDiscount = voucher.getMaxDiscount();
        this.minOrderValue = voucher.getMinOrderValue();
        this.conditionType = voucher.getConditionType();
        this.conditionValue = voucher.getConditionValue();
        this.startDate = voucher.getStartDate();
        this.endDate = voucher.getEndDate();
        this.usageLimit = voucher.getUsageLimit();
        this.usedCount = voucher.getUsedCount();
        this.isActive = voucher.getIsActive();
    }

    // Convert to entity
    public Voucher toEntity() {
        Voucher voucher = new Voucher();
        voucher.setVoucherId(this.voucherId);
        voucher.setCode(this.code);
        voucher.setName(this.name);
        voucher.setDescription(this.description);
        voucher.setDiscountType(this.discountType);
        voucher.setDiscountValue(this.discountValue);
        voucher.setMaxDiscount(this.maxDiscount);
        voucher.setMinOrderValue(this.minOrderValue);
        voucher.setConditionType(this.conditionType);
        voucher.setConditionValue(this.conditionValue);
        voucher.setStartDate(this.startDate);
        voucher.setEndDate(this.endDate);
        voucher.setUsageLimit(this.usageLimit);
        voucher.setUsedCount(this.usedCount);
        voucher.setIsActive(this.isActive);
        return voucher;
    }
}
