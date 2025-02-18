package com.example.backend.service.standard.login;

import com.example.backend.dto.standard.employee.Employee;
import com.example.backend.mapper.standard.login.LoginMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class LoginService {
    private final JwtEncoder jwtEncoder;
    final LoginMapper mapper;

    public String token(Employee employee) {

        Employee db = mapper.selectById(employee.getEmployeeNo());
        List<String> auths = mapper.selectAuthByCommonCode(employee.getEmployeeNo());
        String authString = auths.stream().collect(Collectors.joining(" "));

        if (authString.equals("EMP")) {
            if (db != null) {
                if (db.getEmployeePassword().equals(employee.getEmployeePassword())) {
                    JwtClaimsSet claims = JwtClaimsSet.builder()
                            .issuer("self")
                            .subject(employee.getEmployeeNo())
                            .issuedAt(Instant.now())
//                        .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 7)) 7일 후 만료
//                        .expiresAt(Instant.now().plusSeconds(60)) /*1분후 만료*/
                            .expiresAt(Instant.now().plusSeconds(60 * 60 * 24))
                            .claim("scope", "BIZ")
                            .build();

                    return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
                }
            }
        } else {
            if (db != null) {
                if (db.getEmployeePassword().equals(employee.getEmployeePassword())) {
                    JwtClaimsSet claims = JwtClaimsSet.builder()
                            .issuer("self")
                            .subject(employee.getEmployeeNo())
                            .issuedAt(Instant.now())
//                        .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 7)) 7일 후 만료
//                        .expiresAt(Instant.now().plusSeconds(60)) /*1분후 만료*/
                            .expiresAt(Instant.now().plusSeconds(60 * 60 * 24))
                            .claim("scope", authString)
                            .build();

                    return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
                }
            }
        }
        return null;
    }

    public String getName(String employeeNo) {
        return mapper.selectByIdSearchName(employeeNo);
    }

    public String getCompany(Employee employee) {
        List<String> auths = mapper.selectAuthByCommonCode(employee.getEmployeeNo());
        String authString = auths.stream().collect(Collectors.joining(" "));

        if (authString.equals("CUS")) {
            return mapper.selectCompanyByCode(employee.getEmployeeNo());
        } else {
            return mapper.selectBusinessByCode(employee.getEmployeeNo());
        }
    }

    public Boolean checkUseId(Employee employee) {
        Boolean isActive = mapper.selectIdCheckUse(employee.getEmployeeNo());
        return isActive != null ? isActive : Boolean.FALSE;
    }

    public Boolean checkId(Employee employee) {
        Integer cnt = mapper.selectCheckId(employee.getEmployeeNo());
        return cnt != null && cnt > 0;
    }
}
