package com.example.backend.controller.member;

import com.example.backend.dto.Member;
import com.example.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {
     final MemberService service;

    @PostMapping("add")
    public void addMember(@RequestBody Member member) {
        System.out.println("member = " + member);
        service.addMember(member);

    }
}
