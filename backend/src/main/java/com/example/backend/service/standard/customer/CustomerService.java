package com.example.backend.service.standard.customer;

import com.example.backend.dto.standard.customer.Customer;
import com.example.backend.dto.standard.customer.ItemCode;
import com.example.backend.mapper.standard.customer.CustomerMapper;
import com.example.backend.mapper.standard.employee.EmployeeMapper;
import com.example.backend.mapper.standard.item.ItemMapper;
import com.example.backend.mapper.standard.location.LocationMapper;
import com.example.backend.mapper.standard.warehouse.WarehouseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerService {
    final CustomerMapper mapper;
    final ItemMapper itemMapper;
    final WarehouseMapper warehouseMapper;
    final LocationMapper locationMapper;
    final EmployeeMapper employeeMapper;

    //협력업체 등록
    public Boolean addCustomer(Customer customer) {
        String cus = "CUS";

        // 0 또는 숫자 조회
        Integer maxNo = mapper.viewMaxCustomerCode(cus);

        //  부족한 자리수 만큼  0 채우기
        String newNumber = String.format("%03d", (maxNo == null) ? 1 : maxNo + 1);

        String newCustomerCode = cus + newNumber;
//        System.out.println(newCustomerCode);
        customer.setCustomerCode(newCustomerCode);

        int count = mapper.addCustomer(customer);
        return count == 1;
    }

    //협력사 목록
    public Map<String, Object> getCustomerList(Boolean active, Integer page, String type, String keyword, String sort, String order) {
        int offset = (page - 1) * 10;
//        System.out.println("sort: " + sort);
//        System.out.println("order: " + order);
        //검색
        List<Customer> customerList = mapper.getCustomerList(active, offset, type, keyword, sort, order);
//        System.out.println(customerList);
        //목록 수
        Integer count = mapper.countCustomerList(active, type, keyword);

        return Map.of("customerList", customerList, "count", count);
    }

    //협력사 정보 불러오기
    public Customer viewCustomer(String customerKey) {
//        System.out.println("customerDetail: " + mapper.viewCustomer(customerKey));
        return mapper.viewCustomer(customerKey);
    }

    //협력사 사용여부 = false (사용 안 함)
    public Boolean deleteCustomer(String customerKey) {
        int count = mapper.deleteCustomer(customerKey);
        return count == 1;
    }

    //사용여부를 변경 시도
    public boolean checkActiveChange(Customer customer) {
        //저장되어 있는 사용 여부 vs 입력한 사용여부
        return mapper.getOldActive(customer.getCustomerCode()) != customer.getCustomerActive();
    }

    //active 복구 가능한지
    public boolean checkActive(Customer customer) {
//        System.out.println("복구 가능 여부 확인");
        if (!checkActiveChange(customer)) {
            return false;
        }

        // 사용함으로 복구할 시 같은 아이템을 담당하는 사용중인 회사 여부 확인
        String activeCustomer = mapper.getItemCustomer(customer.getItemCode());
//        System.out.println("복구: " + customer.getCustomerCode());
//        System.out.println("activeCustomer: " + activeCustomer);

        return activeCustomer == null || activeCustomer.equals(customer.getCustomerCode());
    }


    //협력사 정보 수정
    public Boolean editCustomer(Customer customer) {
        // active 수정 시
        if (checkActiveChange(customer)) {
            // customerActive = false 이면 itemActive = false
            mapper.editCustomerActive(customer);
            itemMapper.editItemActive(customer);

            //창고, 사람, 로케이션은 비활성만 연동. 자동 활성화는 안됨
            if (customer.getCustomerActive() == false) {
                employeeMapper.changeEmployeeActive(customer);
                warehouseMapper.editWarehouseActive(customer);

                String warehouseCode = warehouseMapper.getWarehouseCode(customer.getCustomerCode());
                locationMapper.changeLocationActive(warehouseCode, customer.getCustomerActive());

                System.out.println("수정 완료");
            }
        }

        // active 외 수정
        int cnt = mapper.editCustomer(customer);

        return cnt >= 1;
    }

    //품목 목록
    public List<ItemCode> itemCodeList() {
        System.out.println("itemcodelist" + mapper.itemCodeList());
        return mapper.itemCodeList();
    }

    //협력사 작성창 빈칸 확인
    public boolean checkEmptyCustomer(Customer customer) {
        return !(
                customer.getCustomerName() == null || customer.getCustomerRep() == null ||
                        customer.getCustomerNo() == null || customer.getCustomerTel() == null ||
                        customer.getCustomerPost() == null || customer.getCustomerAddress() == null
        );
    }

    public List<Customer> customerCodeNames() {
        return mapper.customerCodeNames();
    }

    //협력사 작성 시 중복 확인
    public boolean checkDuplicateCustomer(Customer customer) {
        Boolean result = false;
        List<String> itemList = mapper.getUsedItemCode();
        List<String> customerNameList = mapper.getUsedCustomerName();
        List<String> customerNoList = mapper.getUsedCustomerNo();
        List<String> customerTelList = mapper.getUsedCustomerTel();

        result = itemList.contains(customer.getItemCode()) || customerNameList.contains(customer.getCustomerName()) ||
                customerNoList.contains(customer.getCustomerNo()) || customerTelList.contains(customer.getCustomerTel());
//        System.out.println("중복 확인 최종" + result);
        return result;
    }

    //삭제된 협력사인지 조회
    public boolean checkDeletedCustomer(String customerKey) {
        List<String> deletedCustomerKey = mapper.getDeletedCustomer();
//        System.out.println("key" + customerKey);
//        System.out.println("목록" + deletedCustomerKey);
//        System.out.println("결과" + deletedCustomerKey.contains(customerKey));
        return deletedCustomerKey.contains(customerKey);
    }

}
