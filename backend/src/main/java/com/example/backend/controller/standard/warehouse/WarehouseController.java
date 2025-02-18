package com.example.backend.controller.standard.warehouse;

import com.example.backend.dto.standard.customer.Customer;
import com.example.backend.dto.standard.warehouse.Warehouse;
import com.example.backend.service.standard.warehouse.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/warehouse")
@RequiredArgsConstructor
public class WarehouseController {

    final WarehouseService service;

    @GetMapping("list")
    @PreAuthorize("#auth.name.startsWith('BIZ')")
    public Map<String, Object> list(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                    @RequestParam(value = "type", defaultValue = "all") String searchType,
                                    @RequestParam(value = "keyword", defaultValue = "") String searchKeyword,
                                    @RequestParam(value = "sort", defaultValue = "") String sort,
                                    @RequestParam(value = "order", defaultValue = "") String order,
                                    @RequestParam(value = "active", defaultValue = "false") Boolean active,
                                    Authentication auth) {
        return service.list(searchType, searchKeyword, page, sort, order, active, auth);
    }

    @GetMapping("view/{warehouseKey}")
    public Warehouse viewWarehouse(@PathVariable Integer warehouseKey) {
        return service.viewWarehouse(warehouseKey);
    }

    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> addWarehouse(@RequestBody Warehouse warehouse) {
        try {
            // 창고 입력 검증
            if (service.validate(warehouse)) {
                // 중복 체크
                if (service.duplicate(warehouse)) {
//        창고 등록 시도
                    if (service.addWarehouse(warehouse)) {
                        return ResponseEntity.ok().body(Map.of(
                                "message", Map.of("type", "success",
                                        "text", "등록되었습니다."),
                                "data", warehouse
                        ));
                    } else {
                        return ResponseEntity.internalServerError().body(Map.of(
                                "message", Map.of("type", "error", "text", "등록에 실패하였습니다.")
                        ));
                    }
                } else {
                    return ResponseEntity.badRequest().body(Map.of(
                            "message", Map.of("type", "error", "text", "중복된 항목이 존재합니다.")
                    ));
                }
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", Map.of("type", "error", "text", "필수 항목이 입력되지 않았습니다.")
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", Map.of("type", "warning",
                            "text", "등록에 실패하였습니다.")));
        }


    }

    @PutMapping("edit")
    public ResponseEntity<Map<String, Map<String, String>>> edit(@RequestBody Warehouse warehouse) {
        try {

            // 창고 입력 검증
            if (service.validate(warehouse)) {
                if (service.edit(warehouse)) {
                    return ResponseEntity.ok(Map.of("message",
                            Map.of("type", "success",
                                    "text", "저장되었습니다.")));
                } else {
                    return ResponseEntity.badRequest()
                            .body(Map.of("message",
                                    Map.of("type", "error",
                                            "text", "저장에 실패하였습니다.")));
                }
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", Map.of("type", "error", "text", "필수 항목이 입력되지 않았습니다.")
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", Map.of("type", "warning",
                            "text", "저장에 실패하였습니다.")));
        }


    }

//    @DeleteMapping("delete/{warehouseKey}")
    //  public void delete(@PathVariable Integer warehouseKey) {
    //    service.delete(warehouseKey);
    //}

    // 협력업체 리스트 가져오기
    @GetMapping("customer")
    public List<Customer> customerList() {

        return service.getWarehouseCustomerList();


    }

    // 관리자 리스트 가져오기
    @GetMapping("employee/{customerCode}")
    public List<Warehouse> employeeList(@PathVariable String customerCode) {
        return service.getWarehouseEmployeeList(customerCode);
    }
}
