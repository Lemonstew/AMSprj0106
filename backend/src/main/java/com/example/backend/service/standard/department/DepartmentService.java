package com.example.backend.service.standard.department;

import com.example.backend.dto.standard.department.Department;
import com.example.backend.mapper.standard.department.DepartmentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class DepartmentService {

    final DepartmentMapper mapper;

    public Map<String, Object> businessDepartmentList(Integer page,
                                                      String searchType,
                                                      String keyword,
                                                      Boolean active,
                                                      String sortColum,
                                                      String sortOrder) {
        int offset = (page - 1) * 10;

        if (searchType.isEmpty()) searchType = "all";
        if (keyword.isEmpty()) keyword = "";


        return Map.of("list", mapper.listDepartmentSelect(offset, searchType, keyword, active, sortColum, sortOrder),
                "count", mapper.departmentCountAll(searchType, keyword, active));
    }

    public boolean validateDepartment(Department department) {
        Boolean name = !department.getDepartmentName().trim().isEmpty();
        Boolean tel = !department.getDepartmentTel().trim().isEmpty();

        return name && tel;
    }

    public boolean updateDepartment(Department department) {
        int cnt = mapper.updateDepartment(department);
        return cnt == 1;
    }

    public boolean addDepartment(Department department) {
        department.setDepartmentCommonCode("BIZ");

        // 0 또는 숫자 조회
        Integer maxNo = mapper.viewMaxDepartmentNo(department.getDepartmentCommonCode());
        //부족한 자리수 만큼 0채우기
        String newNumber = String.format("%03d", (maxNo == null) ? 1 : maxNo + 1);

        String insertCode = department.getDepartmentCommonCode() + newNumber;
        department.setDepartmentCode(insertCode);

        int cnt = mapper.addDepartment(department);

        return cnt == 1;
    }


    public boolean checkSameNameCheck(Department department) {
        String name = department.getDepartmentName().trim();
        return mapper.checkSameName(name) == 0;
    }

    public boolean checkUpdateSameNameCheck(Department department) {
        String name = department.getDepartmentName().trim();
        return mapper.checkSameName(name) > 0;
    }

    public List<Department> getCodeNames() {
        return mapper.getCodeNames();
    }

    public boolean checkAdmin(Authentication auth) {
        String authSlice = auth.getName().trim().substring(0, 3);
        if (authSlice.equals("BIZ")) {
            int cnt = mapper.selectEmployee(auth.getName());
            return cnt == 1;
        } else {
            return false;
        }
    }
}
