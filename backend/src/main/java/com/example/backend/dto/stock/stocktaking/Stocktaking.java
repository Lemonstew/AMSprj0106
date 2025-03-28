package com.example.backend.dto.stock.stocktaking;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Stocktaking {
    private Integer stocktakingKey;
    private String itemCode;
    private String warehouseCode;
    private Integer locationKey;
    private String customerEmployeeNo;
    private Integer countCurrent;
    private Integer countConfiguration;
    private LocalDateTime stocktakingDate;

    //    수량 차이
    private Integer countDifference;
    //    창고명
    private String warehouseName;
    //    품목명
    private String itemName;
    //    협력업체명
    private String customerName;
    //    협력업체 코드
    private String customerCode;
    //    업체 전화번호
    private String customerTel;
    //    협력사 직원 이름
    private String customerEmployeeName;
    //    전화번호
    private String employeeTel;
    //    비고
    private String stocktakingNote;
    //    실사 유형
    private Boolean stocktakingType;

}
