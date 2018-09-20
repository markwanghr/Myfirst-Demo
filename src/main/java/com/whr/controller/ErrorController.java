package com.whr.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("err")
public class ErrorController {

	@RequestMapping("/error")
	public String error(){
		int a = 1 / 0;
		System.out.println(a);
		return "thymeleaf/error";
	}
	
	@RequestMapping("/ajaxError")
	public String ajaxError(){
		int a = 1 / 0;
		System.out.println(a);
		return "thymeleaf/ajaxerror";
	}
	
}
