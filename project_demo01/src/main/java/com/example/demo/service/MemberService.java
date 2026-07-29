package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.repository.MemberRepository;
import com.example.demo.entity.Member;
import org.springframework.lang.NonNull;
import java.util.List;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    public List<Member> getAllMember() {
        return memberRepository.findAll();
    }

    public Member getMemberById(@NonNull Integer id) {
        try {
            return memberRepository.findById(id).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    public String createMember(@NonNull Member member) {
        try {
            memberRepository.save(member);
            return "success";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

    public String updateMember(@NonNull Integer id, @NonNull Member member) {
        try {
            Member mngmember = memberRepository.findById(id).orElse(null);
            if (mngmember == null) {
                return "Member not found";
            }
            mngmember.setPassword(member.getPassword() != null ? member.getPassword() : mngmember.getPassword());
            mngmember.setPrefix(member.getPrefix() != null ? member.getPrefix() : mngmember.getPrefix());
            mngmember.setFirstName(member.getFirstName() != null ? member.getFirstName() : mngmember.getFirstName());
            mngmember.setLastName(member.getLastName() != null ? member.getLastName() : mngmember.getLastName());
            mngmember.setRegisteredHouseNumber(
                    member.getRegisteredHouseNumber() != null ? member.getRegisteredHouseNumber()
                            : mngmember.getRegisteredHouseNumber());
            mngmember.setRegisteredVillageNo(member.getRegisteredVillageNo() != null ? member.getRegisteredVillageNo()
                    : mngmember.getRegisteredVillageNo());
            mngmember.setRegisteredSubdistrict(
                    member.getRegisteredSubdistrict() != null ? member.getRegisteredSubdistrict()
                            : mngmember.getRegisteredSubdistrict());
            mngmember.setRegisteredDistrict(member.getRegisteredDistrict() != null ? member.getRegisteredDistrict()
                    : mngmember.getRegisteredDistrict());
            mngmember.setRegisteredProvince(member.getRegisteredProvince() != null ? member.getRegisteredProvince()
                    : mngmember.getRegisteredProvince());
            mngmember
                    .setRegisteredPostalCode(member.getRegisteredPostalCode() != null ? member.getRegisteredPostalCode()
                            : mngmember.getRegisteredPostalCode());
            mngmember.setBirth(member.getBirth() != null ? member.getBirth() : mngmember.getBirth());
            mngmember.setPhone(member.getPhone() != null ? member.getPhone() : mngmember.getPhone());

            memberRepository.save(mngmember);
            return "success";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

    public String deleteMember(@NonNull Integer id) {
        try {
            memberRepository.deleteById(id);
            return "success";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

}
