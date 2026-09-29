package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import java.util.List;
import com.example.demo.entity.Member;
import com.example.demo.service.MemberService;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping
    public List<Member> getAllMember() {
        return memberService.getAllMember();
    }

    @GetMapping("/{id}")
    public Member viewProfile(@PathVariable @NonNull Integer id) {
        return memberService.getMemberById(id);
    }

    @GetMapping("/citizenId/{citizenId}")
    public Member getMemberByCitizenId(@PathVariable @NonNull String citizenId) {
        return memberService.getMemberByCitizenId(citizenId);
    }

    // method Pass
    @PostMapping
    public String registerMember(@RequestBody @NonNull Member member) {
        String result = memberService.registerMember(member);
        return result;
    }

    @PutMapping("/{id}")
    public String updateProfile(@PathVariable @NonNull Integer id, @RequestBody @NonNull Member member) {
        String result = memberService.updateProfile(id, member);
        return result;
    }

    @DeleteMapping("/{id}")
    public String deleteMember(@PathVariable @NonNull Integer id) {
        String result = memberService.deleteMember(id);
        return result;
    }

}
