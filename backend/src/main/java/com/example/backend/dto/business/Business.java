package com.example.backend.dto.business;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Business {
    private int businessKey;
    private String businessCode;
    private String businessName;
    private String businessRep;
    private String businessNo;
    private String businessTel;
    private String businessFax;
    private String businessAddress;
}
