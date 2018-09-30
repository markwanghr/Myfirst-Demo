package com.whr.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.whr.pojo.Account;
import com.whr.pojo.JSONResult;
import com.whr.service.imp.AccountService;

@Controller
@RequestMapping("bank")
public class BankController {
	// 注入AccountService
	 @Autowired
	private AccountService asi;

	@RequestMapping("/index")
	public String index() {
		return "thymeleaf/bank/index";
	}

	/*@RequestMapping("/add")
	public String add() throws Exception {
		Account account = new Account();
		account.setAccid(6);
		account.setAccname("whr");
		account.setDescription("this is");
		account.setMoney(3121312.0);
		System.out.println(account);
		asi.add(account);
		return "thymeleaf/bank/index";
//		return JSONResult.ok("保存成功！");
	}*/
	@RequestMapping("/add")
	public String add(@RequestParam(value = "accid",required = false) Integer accid, @RequestParam(value = "accname",required = false) String accname,
			@RequestParam(value = "description",required = false) String description, @RequestParam(value = "money",required = false) Double money) throws Exception {
		Account account = new Account();
		System.out.println(accid+"-->"+accname+"-->"+description+"-->"+money);
		account.setAccid(accid);
		account.setAccname(accname);
		account.setDescription(description);
		account.setMoney(money);
		System.out.println(account);
		asi.add(account);
		return "thymeleaf/bank/index";
	}

}
