/*package com.whr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.whr.pojo.Account;
import com.whr.service.AccountService;

@Controller
@RequestMapping("bank")
public class BankController {
	// 注入AccountService
	 @Autowired
	AccountService as;

	@RequestMapping("/index")
	public String index() {
		return "thymeleaf/bank/index";
	}

	@RequestMapping("/add")
	@ResponseBody
	public String add(@RequestParam(value = "accId",required = false) int accId, @RequestParam(value = "accName",required = false) String accName,
			@RequestParam(value = "desc",required = false) String desc, @RequestParam(value = "money",required = false) double money) {
		Account account = new Account();
		System.out.println(accId+"-->"+accName+"-->"+desc+"-->"+money);
		account.setAccId(accId);
		account.setAccName(accName);
		account.setDesc(desc);
		account.setMoney(money);
		System.out.println(account);
		as.add(account);
		return "redirect:/bank/index";
	}

}
*/