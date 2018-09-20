package com.whr.controller;

import java.util.Date;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.whr.pojo.IMoocJSONResult;
import com.whr.pojo.User;

@Controller
@RequestMapping("/user")
public class UserController {
	
	@RequestMapping("/helloUser")
	@ResponseBody
	public User helloUser(){
		User user = new User();
		user.setName("Mark");
		user.setAge(23);
		user.setBirthday(new Date());
		user.setPassword("123456");
		user.setDesc("你好");
		return user;
	}
	
	
	
	@RequestMapping("/helloJsonUser")
	@ResponseBody
	public IMoocJSONResult helloJsonUser(){
		User user = new User();
		user.setName("Mark2");
		user.setAge(23);
		user.setBirthday(new Date());
		user.setPassword("123456");
		user.setDesc("你好");
		return IMoocJSONResult.ok(user);
	}
}
