package com.example.backend.dto.standard.location;

import lombok.Data;

@Data
public class Location {
    private Integer locationKey;
    private String warehouseCode;
    private String row;
    private String col;
    private Integer shelf;
    private String itemCommonCode;
    private String locationNote;
}
