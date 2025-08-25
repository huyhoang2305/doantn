package vn.student.webbangiay.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToggleStatusResponse {
    private Integer id;
    private Boolean isActive;
}
