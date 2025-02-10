package com.example.backend.mapper.stock.stocktaking;

import com.example.backend.dto.stock.stocktaking.Stocktaking;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Set;

@Mapper
public interface StocktakingMapper {
    @Select("""
            <script>
            SELECT s.stocktaking_key,
                   s.item_code,
                   s.warehouse_code,
                   s.customer_employee_no,
                   s.count_current,
                   s.count_configuration,
                   s.count_difference,
                   s.stocktaking_type,
                   s.stocktaking_date,
                   w.warehouse_name,
                   w.customer_code,
                   itcm.common_code_name itemName,
                   cus.customer_name,
                   emp.employee_name customerEmployeeName
            FROM TB_STKTK s
                LEFT JOIN TB_WHMST w ON s.warehouse_code=w.warehouse_code
                LEFT JOIN TB_CUSTMST cus ON w.customer_code=cus.customer_code
                LEFT JOIN TB_SYSCOMM itcm ON s.item_code=itcm.common_code
                LEFT JOIN TB_EMPMST emp ON s.customer_employee_no=emp.employee_no
            WHERE
                <if test="workplace == 'CUS'">
                    w.customer_code=#{workplaceCode}
                </if>
                <if test="workplace == 'BIZ'">
                    1=1
                </if>
                <if test="searchType == 'all'">
                AND (
                    w.customer_code LIKE CONCAT('%',#{searchKeyword},'%')
                 OR cus.customer_name LIKE CONCAT('%',#{searchKeyword},'%')
                 OR itcm.common_code_name LIKE CONCAT('%',#{searchKeyword},'%')
                 OR s.item_code LIKE CONCAT('%',#{searchKeyword},'%')
                 OR s.warehouse_code LIKE CONCAT('%',#{searchKeyword},'%')
                 OR w.warehouse_name LIKE CONCAT('%',#{searchKeyword},'%')
                 OR emp.employee_name LIKE CONCAT('%',#{searchKeyword},'%')
                 OR s.customer_employee_no LIKE CONCAT('%',#{searchKeyword},'%')
                 OR s.stocktaking_type LIKE CONCAT('%',#{searchKeyword},'%')
                 OR s.stocktaking_date LIKE CONCAT('%',#{searchKeyword},'%')
                    )
                </if>
                <if test="searchType != 'all'">
                     <choose>
                         <when test="searchType == 'customer'">
                        AND(
                             cus.customer_name LIKE CONCAT('%',#{searchKeyword},'%')
                          OR w.customer_code LIKE CONCAT('%',#{searchKeyword},'%')
                          )
                         </when>
                         <when test="searchType == 'item'">
                        AND(
                             itcm.common_code_name LIKE CONCAT('%',#{searchKeyword},'%')
                          OR s.item_code LIKE CONCAT('%',#{searchKeyword},'%')
                          )
                         </when>
                         <when test="searchType == 'warehouse'">
                        AND(
                             s.warehouse_code LIKE CONCAT('%',#{searchKeyword},'%')
                          OR w.warehouse_name LIKE CONCAT('%',#{searchKeyword},'%')
                          )
                         </when>
                         <when test="searchType == 'customerEmployee'">
                        AND(
                             s.customer_employee_no LIKE CONCAT('%',#{searchKeyword},'%')
                          OR emp.employee_name LIKE CONCAT('%',#{searchKeyword},'%')
                          )
                         </when>
                         <when test="searchType == 'type'">
                        AND(
                             s.stocktaking_type LIKE CONCAT('%',#{searchKeyword},'%')
                             )
                         </when>
                         <when test="searchType == 'date'">
                        AND(
                             s.stocktaking_date LIKE CONCAT('%',#{searchKeyword},'%')
                             )
                         </when>
                     </choose>
                 </if>
            ORDER BY 
             <if test="sort != null and sort != ''">
                ${sort} ${order}
            </if>
            <if test="sort == null">
               s.stocktaking_date DESC
            </if>
            LIMIT #{pageList},10
            </script>
            """)
    List<Stocktaking> list(String searchType, String searchKeyword, Integer pageList, String sort, String order, String workplaceCode, String workplace);

    @Select("""
            <script>
            SELECT COUNT(*)
            FROM TB_STKTK s
                LEFT JOIN TB_WHMST w ON s.warehouse_code=w.warehouse_code
                LEFT JOIN TB_CUSTMST cus ON w.customer_code=cus.customer_code
                LEFT JOIN TB_SYSCOMM itcm ON s.item_code=itcm.common_code
                LEFT JOIN TB_EMPMST emp ON s.customer_employee_no=emp.employee_no
            WHERE
                <if test="workplace == 'CUS'">
                    w.customer_code=#{workplaceCode}
                </if>
                <if test="workplace == 'BIZ'">
                    1=1
                </if>
                <if test="searchType == 'all'">
                AND (
                    w.customer_code LIKE CONCAT('%',#{searchKeyword},'%')
                 OR cus.customer_name LIKE CONCAT('%',#{searchKeyword},'%')
                 OR itcm.common_code_name LIKE CONCAT('%',#{searchKeyword},'%')
                 OR s.item_code LIKE CONCAT('%',#{searchKeyword},'%')
                 OR s.warehouse_code LIKE CONCAT('%',#{searchKeyword},'%')
                 OR w.warehouse_name LIKE CONCAT('%',#{searchKeyword},'%')
                 OR emp.employee_name LIKE CONCAT('%',#{searchKeyword},'%')
                 OR s.customer_employee_no LIKE CONCAT('%',#{searchKeyword},'%')
                 OR s.stocktaking_type LIKE CONCAT('%',#{searchKeyword},'%')
                 OR s.stocktaking_date LIKE CONCAT('%',#{searchKeyword},'%')
                    )
                </if>
                <if test="searchType != 'all'">
                     <choose>
                         <when test="searchType == 'customer'">
                        AND(
                             cus.customer_name LIKE CONCAT('%',#{searchKeyword},'%')
                          OR w.customer_code LIKE CONCAT('%',#{searchKeyword},'%')
                          )
                         </when>
                         <when test="searchType == 'item'">
                        AND(
                             itcm.common_code_name LIKE CONCAT('%',#{searchKeyword},'%')
                          OR s.item_code LIKE CONCAT('%',#{searchKeyword},'%')
                          )
                         </when>
                         <when test="searchType == 'warehouse'">
                        AND(
                             s.warehouse_code LIKE CONCAT('%',#{searchKeyword},'%')
                          OR w.warehouse_name LIKE CONCAT('%',#{searchKeyword},'%')
                          )
                         </when>
                         <when test="searchType == 'customerEmployee'">
                        AND(
                             s.customer_employee_no LIKE CONCAT('%',#{searchKeyword},'%')
                          OR emp.employee_name LIKE CONCAT('%',#{searchKeyword},'%')
                          )
                         </when>
                         <when test="searchType == 'type'">
                        AND(
                             s.stocktaking_type LIKE CONCAT('%',#{searchKeyword},'%')
                             )
                         </when>
                         <when test="searchType == 'date'">
                        AND(
                             s.stocktaking_date LIKE CONCAT('%',#{searchKeyword},'%')
                             )
                         </when>
                     </choose>
                 </if>
            </script>
            """)
    Integer count(String searchType, String searchKeyword, String workplaceCode, String workplace);

    @Select("""
            SELECT s.stocktaking_key,
                   s.item_code,
                   s.warehouse_code,
                   s.customer_employee_no,
                   s.count_current,
                   s.count_configuration,
                   s.count_difference,
                   s.stocktaking_date,
                   w.warehouse_name,
                   w.customer_code,
                   s.stocktaking_type,
                   itcm.common_code_name itemName,
                   cus.customer_name,
                   emp.employee_name customerEmployeeName
            FROM TB_STKTK s 
                LEFT JOIN TB_WHMST w ON s.warehouse_code=w.warehouse_code
                LEFT JOIN TB_CUSTMST cus ON w.customer_code=cus.customer_code
                LEFT JOIN TB_SYSCOMM itcm ON s.item_code=itcm.common_code
                LEFT JOIN TB_EMPMST emp ON s.customer_employee_no=emp.employee_no
            WHERE stocktaking_key=#{stocktakingKey}
            """)
    Stocktaking view(Integer stocktakingKey);

    @Insert("""
            INSERT INTO TB_STKTK (
                                  item_code, 
                                  warehouse_code, 
                                  customer_employee_no,
                                  count_current,
                                  count_configuration,
                                  stocktaking_note,
                                  stocktaking_type)
            VALUES (#{itemCode}, #{warehouseCode}, #{customerEmployeeNo}, #{countCurrent}, #{countConfiguration}, #{stocktakingNote}, #{stocktakingType})
            """)
    int add(Stocktaking stocktaking);

    @Select("""
            <script>
            SELECT warehouse_name, warehouse_code
            FROM TB_WHMST
            WHERE warehouse_active=1
            <if test="workplace == 'BIZ'">
            </if>
            <if test="workplace == 'CUS'">
            AND customer_code=#{workplaceCode}
            </if>
            </script>
            """)
    List<Stocktaking> getStocktakingWarehouseList(String workplaceCode, String workplace);

    @Select("""
            SELECT i.item_common_code itemCode, s.common_code_name itemName
            FROM TB_WHMST w 
            LEFT JOIN TB_ITEMMST i ON w.customer_code=i.customer_code
            LEFT JOIN TB_SYSCOMM s ON i.item_common_code=s.common_code
            WHERE w.warehouse_code=#{warehouseCode}
            """)
    List<Stocktaking> getStocktakingItemList(String warehouseCode);

    @Select("""
            SELECT employee_workplace_code
            FROM TB_EMPMST
            WHERE employee_no=#{name}
            """)
    String getWorkplaceCode(String name);

    @Select("""
            SELECT l.row
            FROM TB_LOCMST l
            LEFT JOIN TB_WHMST w ON l.warehouse_code=w.warehouse_code
            WHERE w.warehouse_code=#{warehouseCode}  AND l.location_active=1
            ORDER BY l.row ASC
            """)
    Set<String> getWarehouseRowList(String warehouseCode);

    @Select("""
            SELECT l.col
            FROM TB_LOCMST l
            LEFT JOIN TB_WHMST w ON l.warehouse_code=w.warehouse_code
            WHERE w.warehouse_code=#{warehouseCode}  AND l.location_active=1 AND l.row=#{row}
            ORDER BY l.col ASC
            """)
    Set<String> getWarehouseColList(String warehouseCode, String row);

    @Select("""
            SELECT l.shelf
            FROM TB_LOCMST l
            LEFT JOIN TB_WHMST w ON l.warehouse_code=w.warehouse_code
            WHERE w.warehouse_code=#{warehouseCode}  AND l.location_active=1 AND l.row=#{row} AND l.col=#{col}
            ORDER BY l.shelf ASC
            """)
    Set<Integer> getWarehouseShelfList(String warehouseCode, String row, String col);

    @Select("""
            SELECT l.location_key
            FROM TB_LOCMST l
            LEFT JOIN TB_WHMST w ON l.warehouse_code=w.warehouse_code
            WHERE w.warehouse_code=#{warehouseCode} AND l.row=#{row} AND l.col=#{col} AND l.shelf=#{shelf} AND l.location_active=1
            """)
    Integer getStocktakingLocation(String warehouseCode, String row, String col, Integer shelf);

    @Select("""
            SELECT s.serial_no
            FROM TB_INSTK_SUB s
            LEFT JOIN TB_LOCMST l ON s.location_key=l.location_key
            WHERE l.located=1 AND l.location_active AND s.location_key=#{locationKey}
            ORDER BY s.input_stock_sub_key DESC
            LIMIT 1
            """)
    String getLocationValue(Integer locationKey);

    @Select("""
            SELECT l.location_key
            FROM TB_LOCMST l 
            LEFT JOIN TB_WHMST w ON l.warehouse_code=w.warehouse_code
            LEFT JOIN TB_CUSTMST cus ON w.customer_code=cus.customer_code
            LEFT JOIN TB_ITEMSUB its ON cus.item_code=its.item_common_code
            WHERE l.warehouse_code=#{warehouseCode} AND l.located=1 AND l.location_active=1
            """)
    Set<Integer> getAllLocated(String warehouseCode);

    @Select("""
            <script>
            <if test="workType == 'BIZ'">
            SELECT COUNT(*)
            FROM TB_EMPMST
            WHERE employee_no=#{employeeNo}
            </if>
            <if test="workType == 'CUS'">
            SELECT COUNT(*)
            FROM TB_WHMST w
            LEFT JOIN TB_EMPMST emp ON w.customer_code=emp.employee_workplace_code
            WHERE w.warehouse_code=#{warehouseCode} AND emp.employee_no=#{employeeNo}
            </if>
            </script>
            """)
    Integer checkAccess(String warehouseCode, String workType, String employeeNo);

    @Insert("""
            INSERT INTO TB_INSTK_SUB
            (serial_no,
             location_key,
             input_key)
            VALUES ( #{serialNo}, #{locationKey}, 0)
            """)
    int addInstkSub(String serialNo, Integer locationKey);

    @Update("""
            UPDATE TB_LOCMST
            SET located = #{located}
            WHERE location_key=#{locationKey}
            """)
    int updateLocated(Integer locationKey, Integer located);

    @Update("""
            UPDATE TB_INSTK_SUB
            SET location_key=#{locationKey}
            WHERE serial_no=#{serialNo}
            """)
    int updateLocationAtInstkSub(Integer locationKey, String serialNo);

    @Update("""
            UPDATE TB_ITEMSUB
            SET current_common_code=#{currentCommonCode}
            where serial_no=#{serialNo}
            """)
    int updateCurrentCommonCodeBySerialNo(String serialNo, String currentCommonCode);

    @Insert("""
            INSERT INTO TB_INOUT_HIS
                (
                serial_no,
                warehouse_code,
                inout_common_code,
                business_employee_no,
                customer_employee_no,
                location_key,
                inout_no
                )
            VALUES (#{serialNo}, #{warehouseCode}, #{inoutCommonCode}, #{employeeNo}, #{employeeNo}, #{locationKey}, #{inoutNo})
            """)
    int addInoutHistoryPlus(String serialNo, String warehouseCode, String inoutCommonCode, String employeeNo, Integer locationKey, String inoutNo);

    @Insert("""
            INSERT INTO TB_INOUT_HIS
                (
                serial_no,
                warehouse_code,
                inout_common_code,
                business_employee_no,
                customer_employee_no,
                inout_no
                )
            VALUES (#{serialNo}, #{warehouseCode}, #{inoutCommonCode}, #{employeeNo}, #{employeeNo}, #{inoutNo})
            """)
    int addInoutHistoryMinus(String serialNo, String warehouseCode, String inoutCommonCode, String employeeNo, String inoutNo);

    //    실사 번호 등록
    @Select("""
            <script>
                SELECT COALESCE(MAX(CAST(SUBSTRING(inout_no, 4) AS UNSIGNED)), 0) AS maxNumber
                FROM TB_INOUT_HIS
                WHERE inout_no LIKE CONCAT(#{stocktakingCode}, '%')
                AND inout_no REGEXP '^[A-Za-z]+[0-9]+$'
            </script>
            """)
    Integer viewMaxOutputNo(String stocktakingCode);

    @Select("""
            SELECT COUNT(*)
            FROM TB_ITEMSUB
            WHERE item_common_code=#{itemCode} AND serial_no=#{serialNo}
            """)
    int compareSerialNoWithItemCode(String serialNo, String itemCode);

    @Select("""
            SELECT current_common_code
            FROM TB_ITEMSUB
            WHERE serial_no=#{serialNo}
            """)
    String findLocation(String serialNo);


    @Select("""
            SELECT l.location_key
            FROM TB_LOCMST l
            LEFT JOIN TB_INSTK_SUB ins ON l.location_key=ins.location_key
            WHERE ins.serial_no=#{serialNo}
            ORDER BY ins.input_stock_sub_key DESC
            LIMIT 1
            """)
    Integer findLocationKey(String serialNo);

    @Update("""
            UPDATE TB_LOCMST
            SET located=0
            WHERE location_key=#{locKey}
            """)
    int putOffLocated(Integer locKey);
}
