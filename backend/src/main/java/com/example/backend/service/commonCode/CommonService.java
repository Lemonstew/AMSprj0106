package com.example.backend.service.commonCode;

import com.example.backend.dto.commonCode.CommonCode;
import com.example.backend.dto.commonCode.ItemCommonCode;
import com.example.backend.mapper.commonCode.CommonMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class CommonService {
    final CommonMapper mapper;

    public List<CommonCode> selectAllList() {
        return mapper.selectAll();
    }

    //값이 입력되었는지 체크
    public boolean validate(CommonCode commonCode) {
        boolean common_code = !commonCode.getCommonCode().trim().isEmpty();
        boolean common_name = !commonCode.getCommonCodeName().trim().isEmpty();

        return common_code && common_name;
    }

    public boolean addCommonCode(CommonCode commonCode) {
        int cnt = mapper.insertCommonCode(commonCode);
        return cnt == 1;
    }

    // 품목 공통 코드 조회
    public Map<String, Object> getItemCommonCodeList(Integer page, Integer active, String sort, String order, String type, String keyword) {
        Integer offset = (page - 1) * 10;
        return Map.of("list", mapper.getItemCommonCodeList(offset, active, sort, order, type, keyword),
                "count", mapper.countAll(active, type, keyword));
    }

    // 품목 공통 코드 정보 입력됐는지 확인
    public boolean validateItemCommonCode(ItemCommonCode itemCommonCode) {
        // 품목 코드가 null이 아니고, 공백이 아니며, 영문 대문자 3자리로 되어있는지 검증
        boolean isValidItemCommonCode = itemCommonCode.getItemCommonCode() != null &&
                !itemCommonCode.getItemCommonCode().trim().isEmpty() &&
                itemCommonCode.getItemCommonCode().matches("^[A-Z]{3}$");

        // 품목명도 null이 아니고, 공백이 아닌지 확인
        boolean isValidItemCommonName = itemCommonCode.getItemCommonName() != null &&
                !itemCommonCode.getItemCommonName().trim().isEmpty();

        return isValidItemCommonCode && isValidItemCommonName;
    }

    // 품목 공통 코드 중복 화인
    public boolean duplicateItemCommonCode(String itemCommonCode, String itemCommonName) {
        int count = mapper.countByCodeOrName(itemCommonCode, itemCommonName);
        return count > 0;
    }

    // 품목 공통 코드 추가
    public boolean addItemCommonCode(ItemCommonCode itemCommonCode) {
        int cnt = mapper.addItemCommonCode(itemCommonCode);
        return cnt == 1;
    }

    // 품목 공통 코드 1개 정보 가져오기
    public List<ItemCommonCode> getItemCommonCodeView(int itemCommonCodeKey) {
        return mapper.getItemCommonCodeView(itemCommonCodeKey);
    }

    // 품목 공통 코드 삭제하기
    public boolean deleteItemCommonCode(int itemCommonCodeKey) {
        int cnt = mapper.deleteItemCommonCode(itemCommonCodeKey);
        return cnt == 1;
    }

    // 품목 공통 코드 수정하기
    public boolean editItemCommonCode(int itemCommonCodeKey, ItemCommonCode itemCommonCode) {
        int cnt = mapper.editItemCommonCode(itemCommonCodeKey, itemCommonCode);
        return cnt == 1;
    }
}
