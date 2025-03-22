package com.example.backend.service.stock.stocktaking;

import com.example.backend.dto.stock.stocktaking.Stocktaking;
import com.example.backend.dto.stock.stocktaking.StocktakingItem;
import com.example.backend.mapper.standard.item.ItemMapper;
import com.example.backend.mapper.stock.stocktaking.StocktakingMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class StocktakingService {

    final StocktakingMapper mapper;
    final ItemMapper itemMapper;
    private final StocktakingMapper stocktakingMapper;


    public Map<String, Object> list(String searchType, String searchKeyword, Integer page, String sort, String order, Authentication auth) {
        Integer pageList = (page - 1) * 10;
        sort = resolveType(toSnakeCase(sort));

        String workplaceCode = mapper.getWorkplaceCode(auth.getName());
        String workplace = workplaceCode.substring(0, 3);

        return Map.of("list", mapper.list(searchType, searchKeyword, pageList, sort, order, workplaceCode, workplace), "count", mapper.count(searchType, searchKeyword, workplaceCode, workplace));
    }

    // camelCase를 snake_case로 변환하는 로직
    private String toSnakeCase(String camelCase) {
        if (camelCase == null || camelCase.isEmpty()) {
            return camelCase; // null 이거나 빈 문자열은 그대로 반환
        }
        return camelCase
                .replaceAll("([a-z])([A-Z])", "$1_$2") // 소문자 뒤 대문자에 언더스코어 추가
                .toLowerCase(); // 전체를 소문자로 변환
    }

    // type 값에 따라 해당하는 SQL 필드명으로 변경
    private String resolveType(String type) {
        if (type == null || type.isEmpty() || type.equals("all")) {
            return null;
        }
        switch (type) {
            case "stocktaking_key":
                return "s.stocktaking_key";
            case "item_common_name":
                return "itcm.common_code_name";
            case "customer_name":
                return "cus.customer_name";
            case "count_current":
                return "s.count_current";
            case "count_configuration":
                return "s.count_configuration";
            case "count_difference":
                return "s.count_difference";
            case "warehouse_name":
                return "w.warehouse_name";
            case "stocktaking_type":
                return "s.stocktaking_type";
            case "customer_employee_name":
                return "emp.employee_name";
            case "stocktaking_date":
                return "s.stocktaking_date";
            default:
                throw new IllegalArgumentException("Invalid type: " + type);
        }
    }

    public Stocktaking view(Integer stocktakingKey) {
        return mapper.view(stocktakingKey);
    }

    public Boolean add(Stocktaking stocktaking) {
        stocktaking.setStocktakingDate(LocalDateTime.now());


        return mapper.add(stocktaking) == 1;
    }

    public List<Stocktaking> getStocktakingWarehouseList(Authentication auth) {

        String workplaceCode = mapper.getWorkplaceCode(auth.getName());
        String workplace = workplaceCode.substring(0, 3);

        return mapper.getStocktakingWarehouseList(workplaceCode, workplace);


    }

    public List<Stocktaking> getStocktakingItemList(String warehouseCode) {

        return mapper.getStocktakingItemList(warehouseCode);
    }

    public Boolean validate(Stocktaking stocktaking, Authentication auth) {
        stocktaking.setCustomerEmployeeNo(auth.getName());


        return
                !(
                        stocktaking.getWarehouseCode() == null || stocktaking.getWarehouseCode().trim().isEmpty() ||
                                stocktaking.getItemCode() == null || stocktaking.getItemCode().trim().isEmpty() ||
                                stocktaking.getCountCurrent() == null ||
                                stocktaking.getCountConfiguration() == null ||
                                stocktaking.getStocktakingType() == null ||
                                stocktaking.getCustomerEmployeeNo() == null || stocktaking.getCustomerEmployeeNo().trim().isEmpty());
    }

    // 권한 확인
    public Boolean checkAccess(String warehouseCode, Authentication auth) {


        String employeeNo = auth.getName();

        String workType = employeeNo.substring(0, 3);

        Integer access = mapper.checkAccess(warehouseCode, workType, employeeNo);

        return access == 1;
    }

    public Integer getStocktakingCountCurrent(String warehouseCode) {

        Set<?> locatedList = mapper.getAllLocated(warehouseCode);
        Integer countCurrent = (locatedList != null) ? locatedList.size() : 0;

        return countCurrent;
    }

    public Set<String> getWarehouseRowList(String warehouseCode) {

        return mapper.getWarehouseRowList(warehouseCode);

    }

    public Set<String> getWarehouseColList(String warehouseCode, String row) {

        return mapper.getWarehouseColList(warehouseCode, row);

    }

    public Set<Integer> getWarehouseShelfList(String warehouseCode, String row, String col) {

        return mapper.getWarehouseShelfList(warehouseCode, row, col);


    }

    public Integer getStocktakingLocationList(String warehouseCode, String row, String col, Integer shelf) {


        return mapper.getStocktakingLocation(warehouseCode, row, col, shelf);

    }

    public String getLocationValue(Integer locationKey) {
        return mapper.getLocationValue(locationKey);
    }

    // 반영할 때 정보 모두 썼는지, 잘 입력 됐는지
    public Boolean validateUpdate(StocktakingItem stocktakingItem) {

        return
                !(
                        stocktakingItem.getWarehouseCode() == null || stocktakingItem.getWarehouseCode().trim().isEmpty() ||
                                stocktakingItem.getItemCode() == null || stocktakingItem.getItemCode().trim().isEmpty() ||
                                stocktakingItem.getSerialNo() == null || stocktakingItem.getSerialNo().trim().isEmpty() ||
                                stocktakingItem.getPutStocktakingType() == null || stocktakingItem.getPutStocktakingType().trim().isEmpty() ||
                                stocktakingItem.getMakeDifference() == null || stocktakingItem.getMakeDifference().trim().isEmpty() ||
                                stocktakingItem.getLocationKey() == null ||
                                stocktakingItem.getRow() == null || stocktakingItem.getRow().trim().isEmpty() ||
                                stocktakingItem.getCol() == null || stocktakingItem.getCol().trim().isEmpty() ||
                                stocktakingItem.getShelf() == null
                );
    }

    public Boolean updateLocation(StocktakingItem stocktakingItem, Authentication auth) {

        if (stocktakingItem.getPutStocktakingType().equals("new")) {
            String currentCommonCode = "WHS";

            // 품목 상세에서 시리얼 넘버 최대값 가져오기
            Integer maxSerialNo = itemMapper.viewMaxSerialNoByItemCode(stocktakingItem.getItemCode());

            // 시리얼 번호 생성 (20자리)
            String insertSerialNo = "S" + String.format("%05d", (maxSerialNo == null) ? 1 : maxSerialNo + 1);

            stocktakingItem.setSerialNo(insertSerialNo);

            String warehouseCode = stocktakingItem.getWarehouseCode();
            String serialNo = stocktakingItem.getSerialNo();
            String inoutCommonCode = "STKP";
            String employeeNo = auth.getName();
            Integer locationKey = stocktakingItem.getLocationKey();

            System.out.println(stocktakingItem.getSerialNo());
            // item_sub 테이블에 추가
            int insertItemSub = itemMapper.addItemSub(stocktakingItem.getItemCode(), stocktakingItem.getSerialNo(), currentCommonCode);

//            입고 테이블에 추가
            int insertInstkSub = mapper.addInstkSub(stocktakingItem.getSerialNo(), stocktakingItem.getLocationKey());

//            해당 로케이션 위치를 재고 여부 활성화로 변경
            Integer located = 1;
            int insertLocation = mapper.updateLocated(stocktakingItem.getLocationKey(), located);

            // 실사 번호 생성
            String stocktakingCode = "STK";
            Integer maxNo = mapper.viewMaxOutputNo(stocktakingCode);
            String newNumber = String.format("%03d", (maxNo == null) ? 1 : maxNo + 1);
            stocktakingItem.setNewStocktakingNo(stocktakingCode + newNumber);
            String inoutNo = stocktakingItem.getNewStocktakingNo();

            int insertInoutHistory = mapper.addInoutHistoryPlus(serialNo, warehouseCode, inoutCommonCode, employeeNo, locationKey, inoutNo);

            return insertItemSub == 1 && insertInstkSub == 1 && insertLocation == 1 && insertInoutHistory == 1;

        } else if (stocktakingItem.getPutStocktakingType().equals("old")) {
//            UPDATE 로 ITEMSUB 의 current_common_code WHS로 바꾸기
            String serialNo = stocktakingItem.getSerialNo();
            Integer locationKey = stocktakingItem.getLocationKey();
            String currentCommonCode = "WHS";
            String warehouseCode = stocktakingItem.getWarehouseCode();
            String inoutCommonCode = "STKP";
            String employeeNo = auth.getName();
            String itemCode = stocktakingItem.getItemCode();

            // 다른 회사의 물품 등록 불가
            int compare = mapper.compareSerialNoWithItemCode(serialNo, itemCode);
            if (compare == 1) {
                String currentLocated = mapper.findLocation(serialNo);
                if (currentLocated.equals("WHS")) {
                    Integer locKey = mapper.findLocationKey(serialNo);
                    mapper.putOffLocated(locKey);
                } else {
                    mapper.updateCurrentCommonCodeBySerialNo(serialNo, currentCommonCode);
                }

//            로케이션 키값 변경
                int updateLocation = mapper.updateLocationAtInstkSub(locationKey, serialNo);

//            해당 로케이션 위치를 재고여부 활성화로 변경
                Integer located = 1;
                int insertLocation = mapper.updateLocated(locationKey, located);

                // 실사 번호 생성
                String stocktakingCode = "STK";
                Integer maxNo = mapper.viewMaxOutputNo(stocktakingCode);
                String newNumber = String.format("%03d", (maxNo == null) ? 1 : maxNo + 1);
                stocktakingItem.setNewStocktakingNo(stocktakingCode + newNumber);
                String inoutNo = stocktakingItem.getNewStocktakingNo();
                int insertInoutHistory = mapper.addInoutHistoryPlus(serialNo, warehouseCode, inoutCommonCode, employeeNo, locationKey, inoutNo);
//
                return updateLocation == 1 && insertLocation == 1 && insertInoutHistory == 1;
            } else {
                return false;
            }

        } else if (stocktakingItem.getPutStocktakingType().equals("lost")) {
//            실사 분실인 상태
            String serialNo = stocktakingItem.getSerialNo();
            String currentCommonCode = "LOS";
            Integer locationKey = stocktakingItem.getLocationKey();
            String warehouseCode = stocktakingItem.getWarehouseCode();
            String inoutCommonCode = "LOS";
            String employeeNo = auth.getName();

//            current_common_code를 LOS 상태로 변경
            int updateItemSub = mapper.updateCurrentCommonCodeBySerialNo(serialNo, currentCommonCode);

//            해당 로케이션 위치를 비활성화로 변경
            Integer located = 0;
            int insertLocation = mapper.updateLocated(locationKey, located);

            // 실사 번호 생성
            String stocktakingCode = "STK";
            Integer maxNo = mapper.viewMaxOutputNo(stocktakingCode);
            String newNumber = String.format("%03d", (maxNo == null) ? 1 : maxNo + 1);
            stocktakingItem.setNewStocktakingNo(stocktakingCode + newNumber);
            String inoutNo = stocktakingItem.getNewStocktakingNo();

            int insertInoutHistory = mapper.addInoutHistoryMinus(serialNo, warehouseCode, inoutCommonCode, employeeNo, inoutNo);

            return updateItemSub == 1 && insertLocation == 1 && insertInoutHistory == 1;

        } else {
            return false;
        }
//        mapper.updateStockStatus(stocktakingItem);
    }


//    로케이션 정보 불러오기.
//    public List<Integer> getStocktakingLocationList(String warehouseCode, String difference) {
//
//        Integer getCode;
//
//        if (difference.equals("1")) {
////            전산수량이 많을 경우 > 물품을 삭제해야 함 > located = true 불러옴
//            getCode = 1;
//            return mapper.getStocktakingLocationList(warehouseCode, getCode);
//        } else {
////            실제수량이 많을 경우
//            getCode = 0;
//            return mapper.getStocktakingLocationList(warehouseCode, getCode);
//        }
//
//    }
}
