package com.example.backend.mapper.state.install;

import com.example.backend.dto.state.install.Install;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface InstallMapper {
    // 설치 요청 데이터 추가
    @Insert("""
            INSERT INTO TB_INSTL_REQ
            (install_request_key, item_common_code, franchise_code, business_employee_no, customer_code, install_request_amount, install_request_note)
            VALUES (#{installRequestKey}, #{itemCommonCode}, #{franchiseCode}, #{businessEmployeeNo}, #{customerCode}, #{installRequestAmount}, #{installRequestNote})
            """)
    @Options(keyProperty = "installRequestKey", useGeneratedKeys = true)
    int installRequest(Install install);

    // 설치 요청 가능한 가맹점, 가맹점 주소 가져오기
    @Select("""
            SELECT franchise_code, franchise_name, franchise_address
            FROM TB_FRNCHSMST
            WHERE franchise_active = 1
            """)
    List<Map<String, String>> getInstallFranchiseList();

    // 설치 가능한 품목-협럭업체 리스트
    @Select("""
            SELECT i.item_common_code, sc.common_code_name as item_common_name, c.customer_code, c.customer_name, COUNT(it.item_common_code) as count_item
            FROM TB_ITEMMST i 
            LEFT JOIN TB_CUSTMST c ON i.item_common_code = c.item_code
            LEFT JOIN TB_SYSCOMM sc ON i.item_common_code = sc.common_code
            LEFT JOIN TB_ITEMSUB it ON i.item_common_code = it.item_common_code
            WHERE it.current_common_code = 'WHS'
            AND it.item_sub_active = 1
            GROUP BY i.item_common_code
            """)
    List<Map<String, Object>> getInstallItemList();

    // 설치 요청에 대한 정보 가져오기
    @Select("""
            SELECT DISTINCT i.install_request_key, f.franchise_name, i.item_common_code, sc.common_code_name as item_common_name, i.install_request_amount, f.franchise_address,
            i.business_employee_no, e.employee_name as business_employee_name, w.warehouse_name, w.warehouse_address, i.install_request_note, i.install_request_date,
            i.customer_code, i.install_request_consent, c.customer_name
            FROM TB_INSTL_REQ i
            LEFT JOIN TB_FRNCHSMST f ON i.franchise_code = f.franchise_code
            LEFT JOIN TB_SYSCOMM sc ON i.item_common_code = sc.common_code
            LEFT JOIN TB_EMPMST e ON i.business_employee_no = e.employee_no
            LEFT JOIN TB_WHMST w ON i.customer_code = w.customer_code
            LEFT JOIN TB_CUSTMST c ON i.item_common_code = c.item_code
            WHERE i.install_request_key = #{installKey}
            """)
    Install getInstallRequestView(int installKey);

    // 설치 기사 사번으로 이름 가져오기
    @Select("""
            SELECT e.employee_no as customer_installer_no, e.employee_name as customer_installer_name
            FROM TB_INSTL_REQ i
            LEFT JOIN TB_CUSTMST c ON i.customer_code = c.customer_code
            LEFT JOIN TB_EMPMST e ON c.customer_code = e.employee_workplace_code
            WHERE i.install_request_key = #{installKey}
            AND e.employee_active = 1
            """)
    List<Map<String, Object>> getCustomerEmployee(int installKey);

    // 출고 번호 등록
    @Select("""
            <script>
                SELECT COALESCE(MAX(CAST(SUBSTRING(output_no, 4) AS UNSIGNED)), 0) AS maxNumber
                FROM TB_INSTL_APPR
                WHERE output_no LIKE CONCAT(#{outputCode}, '%')
                AND output_no REGEXP '^[A-Za-z]+[0-9]+$'
            </script>
            """)
    Integer viewMaxOutputNo(String outputCode);

    // 설치 승인 테이블에 추가
    @Insert("""
            INSERT INTO TB_INSTL_APPR
            (install_approve_key, install_request_key, customer_employee_no, customer_installer_no, output_no, install_schedule_date, install_approve_note)
            VALUES (#{installApproveKey}, #{installRequestKey}, #{customerEmployeeNo}, #{customerInstallerNo}, #{outputNo}, #{installScheduleDate}, #{installApproveNote})
            """)
    @Options(keyProperty = "installApproveKey", useGeneratedKeys = true)
    int installApprove(Install install);

    // 설치 요청에서 수량만큼 시리얼 번호 가져오기
    @Select("""
            SELECT serial_no
            FROM TB_ITEMSUB
            WHERE item_common_code = #{itemCommonCode}
              AND item_sub_active = 1
              AND current_common_code='WHS'
            ORDER BY item_sub_key ASC
            LIMIT #{num}
            """)
    List<String> getSerials(String itemCommonCode, int num);

    // 가져온 시리얼 번호 리스트를 TB_INSTL_SUB에 삽입
    @Insert("""
            INSERT INTO TB_INSTL_SUB
            (output_no, serial_no)
            VALUES ( #{outputNo}, #{serialNo})
            """)
    @Options(keyProperty = "installSubKey", useGeneratedKeys = true)
    int addSerialToApprove(Install install);

    // ITEM_SUB에서 해당 시리얼 번호 품목의 active 값을 0으로 업데이트
    @Update("""
            UPDATE TB_ITEMSUB
            SET item_sub_active = 0
            WHERE serial_no = #{serialNo}
            """)
    int updateItemSubActiveFalse(String serialNo);

    // 요청 테이블의 승인 여부 true 처리
    @Update("""
            UPDATE TB_INSTL_REQ
            SET install_request_consent = true
            WHERE install_request_key = #{installRequestKey}
            """)
    int updateRequestConsent(Integer installRequestKey);

    // 설치 승인에 대한 정보 가져오기
    @Select("""
            SELECT ia.install_approve_key, f.franchise_name, sc.common_code_name as item_common_name, ia.output_no, f.franchise_code, f.franchise_address, 
            ir.business_employee_no, e1.employee_name as business_employee_name,
            ia.customer_employee_no, e2.employee_name as customer_employee_name,  
            ia.customer_installer_no, e3.employee_name as customer_installer_name, ia.install_approve_note,
            ia.install_approve_consent as consent, ir.install_request_date, ia.install_approve_date,
            ih.inout_history_date, ih.inout_history_note, ir.install_request_amount, ia.install_schedule_date,
            GROUP_CONCAT(DISTINCT ts.serial_no) AS serial_numbers
            FROM TB_INSTL_APPR ia
            LEFT JOIN TB_INSTL_REQ ir ON ia.install_request_key = ir.install_request_key
            LEFT JOIN TB_FRNCHSMST f ON ir.franchise_code = f.franchise_code
            LEFT JOIN TB_SYSCOMM sc ON ir.item_common_code = sc.common_code
            LEFT JOIN TB_EMPMST e1 ON ir.business_employee_no = e1.employee_no -- 요청자 조인
            LEFT JOIN TB_EMPMST e2 ON ia.customer_employee_no = e2.employee_no -- 승인자 조인
            LEFT JOIN TB_EMPMST e3 ON ia.customer_installer_no = e3.employee_no -- 설치자 조인
            LEFT JOIN TB_INSTL_SUB ts ON ia.output_no = ts.output_no
            LEFT JOIN TB_INOUT_HIS ih ON ia.output_no = ih.inout_no
            WHERE ia.install_approve_key = #{installKey}
            GROUP BY ia.install_approve_key
            """)
    Install getInstallApproveView(int installKey);

    // ITEM_SUB에서 해당 시리얼 번호 품목의 active 값을 1으로 업데이트
    @Update("""
            UPDATE TB_ITEMSUB
            SET item_sub_active = 1
            WHERE serial_no = #{serialNo}
            """)
    int updateItemSubActiveTrue(String serialNo);

    // 시리얼 번호 상세에 현재 위치 가맹점으로 변경
    @Update("""
            UPDATE TB_ITEMSUB
            SET current_common_code = 'FRN'
            WHERE serial_no = #{serialNo}
            """)
    int updateSerialCurrent(String serialNo);

    // 시리얼 번호에 맞는 location 키 가져오가
    @Select("""
            SELECT location_key
            FROM TB_INSTK_SUB
            WHERE serial_no = #{serailNo}
            """)
    List<Integer> getLocationKeyList(String serial);

    // 시리얼 번호에 맞는 location 비활성화
    @Update("""
            UPDATE TB_LOCMST
            SET located = 0
            WHERE location_key = #{locationKey}
            """)
    int updateLocaionActive(Integer locationKey);

    // 승인 테이블에 상태 true로 변경
    @Update("""
            UPDATE TB_INSTL_APPR
            SET install_approve_consent = 1
            WHERE output_no = #{outputNo}
            """)
    int updateApproveConsent(String outputNo);

    // 시리얼 번호로 입출력 테이블에서 입고된 기록 가져오기(창고 코드)
    @Select("""
            SELECT warehouse_code
            FROM TB_INOUT_HIS
            WHERE serial_no = #{serialNo}
            AND inout_common_code IN ('INSTK', 'RETURN', 'STKP')
            ORDER BY inout_history_key DESC
            LIMIT 1;
            """)
    String getWarehouseCode(String serialNo);

    // 품목 입출력 테이블에 데이터 추가
    @Insert("""
            INSERT INTO TB_INOUT_HIS
            (serial_no, inout_no, warehouse_code, inout_common_code, customer_employee_no, business_employee_no, franchise_code, location_key, inout_history_note)
            VALUES (#{serialNo}, #{outputNo}, #{warehouseCode}, 'OUT', #{customerEmployeeNo}, #{businessEmployeeNo}, #{franchiseCode}, NULL,  #{inoutHistoryNote})
            """)
    int addOutHistory(Install install);

    // 설치 요청, 승인 리스트 가져오기
    @Select("""
            <script>
                SELECT DISTINCT ir.install_request_key as installRequestKey,
                    ia.install_approve_key,
                    f.franchise_name           as franchiseName,
                    sc.common_code_name        as itemCommonName,
                    c.customer_name            as customerName,
                    ir.business_employee_no,
                    e1.employee_name           as businessEmployeeName,
                    w.warehouse_name           as warehouseName,
                    ir.install_request_consent as installRequestConsent,
                    ia.output_no               as outputNo,
                    ia.customer_employee_no,
                    -- 반려자가 있는 경우 반려자 이름을 customerEmployeeName으로 설정
                    CASE
                        WHEN ir.install_request_consent = 0 THEN e4.employee_name
                        ELSE e2.employee_name
                    END AS customerEmployeeName,
                    e3.employee_name           as customerInstallerName,
                    ia.install_approve_date    as installApproveDate,
                    ir.install_request_date    as installRequestDate,
                    ih.inout_history_date      as inoutHistoryDate,
                    ia.install_approve_consent as installApproveConsent,
                    -- NULL을 고려하여 최댓값을 정확하게 선택
                    GREATEST(
                        COALESCE(ir.install_request_date, '0001-01-01'),
                        COALESCE(ia.install_approve_date, '0001-01-01'),
                        COALESCE(ih.inout_history_date, '0001-01-01'),
                        COALESCE(da.disapprove_date, '0001-01-01')
                    ) AS installDate
                FROM TB_INSTL_REQ ir
                    LEFT JOIN TB_INSTL_APPR ia ON ir.install_request_key = ia.install_request_key
                    LEFT JOIN TB_DISPR da ON ir.install_request_key = da.state_request_key AND da.state_common_code = 'INSTL'
                    LEFT JOIN TB_FRNCHSMST f ON ir.franchise_code = f.franchise_code
                    LEFT JOIN TB_SYSCOMM sc ON ir.item_common_code = sc.common_code
                    LEFT JOIN TB_EMPMST e1 ON ir.business_employee_no = e1.employee_no -- 요청자 조인
                    LEFT JOIN TB_EMPMST e2 ON ia.customer_employee_no = e2.employee_no -- 승인자 조인
                    LEFT JOIN TB_EMPMST e3 ON ia.customer_installer_no = e3.employee_no -- 설치자 조인
                    LEFT JOIN TB_EMPMST e4 ON da.disapprove_employee_no = e4.employee_no -- 반려자 조인
                    LEFT JOIN TB_CUSTMST c ON sc.common_code = c.item_code
                    LEFT JOIN TB_WHMST w ON ir.customer_code = w.customer_code
                    LEFT JOIN TB_INOUT_HIS ih ON ia.output_no = ih.inout_no
                WHERE 1=1
                AND (#{company} IS NULL OR c.customer_code = #{company})
                <if test="state == 'request'">
                    AND ir.install_request_consent IS NULL
                </if>
                <if test="state == 'approve'">
                    AND (ir.install_request_consent = true AND ia.install_approve_consent IS NULL)
                </if>
                <if test="state == 'configuration'">
                    AND ia.install_approve_consent = true
                </if>
                <if test="state == 'disapprove'">
                    AND (ir.install_request_consent = false OR ia.install_approve_consent = false)
                </if>
            
                <if test="keyword != null and keyword.trim()!=''">
                    AND (
                        <trim prefixOverrides="OR">
                            <if test="type=='all' or type=='franchiseName'">
                                f.franchise_name LIKE CONCAT('%', #{keyword}, '%')
                            </if>                
                            <if test="type=='all' or type=='itemCommonName'">
                                OR sc.common_code_name LIKE CONCAT('%', #{keyword}, '%')
                            </if>
                            <if test="type=='all' or type=='customerName'">
                                OR c.customer_name LIKE CONCAT('%', #{keyword}, '%')
                            </if>
                            <if test="type=='all' or type=='outputNo'">
                                OR ia.output_no LIKE CONCAT('%', #{keyword}, '%')
                            </if>                
                            <if test="type=='all' or type=='businessEmployeeName'">
                                OR e1.employee_name LIKE CONCAT('%', #{keyword}, '%')
                                OR e1.employee_no LIKE CONCAT('%', #{keyword}, '%')
                            </if>
                            <if test="type=='all' or type=='customerEmployeeName'">
                                OR e2.employee_name LIKE CONCAT('%', #{keyword}, '%')
                                OR e2.employee_no LIKE CONCAT('%', #{keyword}, '%')
                                OR e4.employee_name LIKE CONCAT('%', #{keyword}, '%')
                                OR e4.employee_no LIKE CONCAT('%', #{keyword}, '%')
                            </if>
                            <if test="type=='all' or type=='customerInstallerName'">
                                OR e3.employee_name LIKE CONCAT('%', #{keyword}, '%')
                                OR e3.employee_no LIKE CONCAT('%', #{keyword}, '%')
                            </if>
                            <if test="type=='all' or type=='warehouseName'">
                                OR w.warehouse_name LIKE CONCAT('%', #{keyword}, '%')
                            </if>         
                        </trim>
                    )    
                </if>
            
                <if test="sort != null and sort != ''">
                    ORDER BY ${sort} ${order}
                </if>
                <if test="sort == null or sort == ''">
                    ORDER BY installDate DESC
                </if>
                LIMIT #{offset}, 10
            </script>
            """)
    List<Install> getInstallList(Integer offset, String sort, String order, String state, String type, String keyword, String company);

    // 총 페이지 수 계산
    @Select("""
            <script>
                SELECT COUNT(DISTINCT ir.install_request_key)
                FROM TB_INSTL_REQ ir
                LEFT JOIN TB_INSTL_APPR ia ON ir.install_request_key = ia.install_request_key
                LEFT JOIN TB_DISPR da ON ir.install_request_key = da.state_request_key
                LEFT JOIN TB_FRNCHSMST f ON ir.franchise_code = f.franchise_code
                LEFT JOIN TB_SYSCOMM sc ON ir.item_common_code = sc.common_code
                LEFT JOIN TB_EMPMST e1 ON ir.business_employee_no = e1.employee_no 
                LEFT JOIN TB_EMPMST e2 ON ia.customer_employee_no = e2.employee_no
                LEFT JOIN TB_EMPMST e3 ON ia.customer_installer_no = e3.employee_no 
                LEFT JOIN TB_EMPMST e4 ON da.disapprove_employee_no = e4.employee_no
                LEFT JOIN TB_CUSTMST c ON sc.common_code = c.item_code
                LEFT JOIN TB_WHMST w ON ir.customer_code = w.customer_code
                WHERE 1=1
                AND (#{company} IS NULL OR c.customer_code = #{company})
                <if test="state == 'request'">
                    AND ir.install_request_consent IS NULL
                </if>
                <if test="state == 'approve'">
                    AND (ir.install_request_consent = true AND ia.install_approve_consent IS NULL)
                </if>
                <if test="state == 'configuration'">
                    AND ia.install_approve_consent = true
                </if>
                <if test="state == 'disapprove'">
                    AND (ir.install_request_consent = false OR ia.install_approve_consent = false)
                </if>
            
                 <if test="keyword != null and keyword.trim()!=''">
                AND (
                    <trim prefixOverrides="OR">
                        <if test="type=='all' or type=='franchiseName'">
                            f.franchise_name LIKE CONCAT('%', #{keyword}, '%')
                        </if>                
                        <if test="type=='all' or type=='itemCommonName'">
                            OR sc.common_code_name LIKE CONCAT('%', #{keyword}, '%')
                        </if>
                        <if test="type=='all' or type=='customerName'">
                            OR c.customer_name LIKE CONCAT('%', #{keyword}, '%')
                        </if>
                        <if test="type=='all' or type=='outputNo'">
                            OR ia.output_no LIKE CONCAT('%', #{keyword}, '%')
                        </if>                
                        <if test="type=='all' or type=='businessEmployeeName'">
                            OR e1.employee_name LIKE CONCAT('%', #{keyword}, '%')
                            OR e1.employee_no LIKE CONCAT('%', #{keyword}, '%')
                        </if>
                        <if test="type=='all' or type=='customerEmployeeName'">
                            OR e2.employee_name LIKE CONCAT('%', #{keyword}, '%')
                            OR e2.employee_no LIKE CONCAT('%', #{keyword}, '%')
                        </if>
                        <if test="type=='all' or type=='customerInstallerName'">
                            OR e3.employee_name LIKE CONCAT('%', #{keyword}, '%')
                            OR e3.employee_no LIKE CONCAT('%', #{keyword}, '%')
                            OR e4.employee_name LIKE CONCAT('%', #{keyword}, '%')
                            OR e4.employee_no LIKE CONCAT('%', #{keyword}, '%')
                        </if>
                        <if test="type=='all' or type=='warehouseName'">
                            OR w.warehouse_name LIKE CONCAT('%', #{keyword}, '%')
                        </if>         
                    </trim>
                )    
            </if>
            </script>
            """)
    Integer countAll(String state, String type, String keyword, String company);

    // ITEM_INSTL_SUB에서 해당 발주 번호의 시리얼 번호 가져오기
    @Select("""
            SELECT serial_no
            FROM TB_INSTL_SUB
            WHERE output_no = #{outputNo}
            """)
    List<String> getConfigurationSerials(String outputNo);

    // 설치 승인 반려 상태 업데이트
    @Update("""
            UPDATE TB_INSTL_REQ
            SET install_request_consent = 0
            WHERE install_request_key=#{installRequestKey}
            """)
    int updateDisapprove(Install install);

    // 설치 요청 반려 테이블에 추가
    @Insert("""
            INSERT INTO TB_DISPR
            (state_request_key, state_common_code, disapprove_employee_no, disapprove_note)
            VALUES (#{installRequestKey},'INSTL', #{customerEmployeeNo}, #{disapproveNote})
            """)
    int installDisapprove(Install install);

    // 설치 요청 키로 담당업체 코드 가져오기
    @Select("""
            SELECT customer_code
            FROM TB_INSTL_REQ
            WHERE install_request_key = #{installKey}
            """)
    String getCustomerCodeByKey(int installKey);

    // 설치 승인 후 추가 데이터(승인 날짜, 출고 번호, 시리얼) 가져오기
    @Select("""
            SELECT a.output_no, a.install_approve_date, GROUP_CONCAT(DISTINCT s.serial_no) AS serial_numbers
            FROM TB_INSTL_APPR a
            LEFT JOIN TB_INSTL_SUB s ON a.output_no = s.output_no
            WHERE install_request_key = #{installKey}
            """)
    Install getInstallApproveData(int installKey);

    // 권한 설정 :  로그인 아이디로 회사 코드 가져오기
    @Select("""
            SELECT e.employee_workplace_code
            FROM TB_EMPMST e
                     JOIN TB_CUSTMST c ON e.employee_workplace_code = c.customer_code
            WHERE e.employee_no = #{id}
            """)
    String selectCompanyById(String id);

    // 설치 반려 후 추가 데이터(반려 날짜, 반려자, 반려 비고) 가져오기
    @Select("""
            SELECT d.disapprove_employee_no, e.employee_name as disapproveEmployeeName, d.disapprove_date, d.disapprove_note
            FROM TB_DISPR d
                LEFT JOIN TB_EMPMST e ON d.disapprove_employee_no = e.employee_no
            WHERE state_request_key = #{installKey}
            AND state_common_code = 'INSTL'
            """)
    Install getInstalldisApproveData(int installKey);
}
