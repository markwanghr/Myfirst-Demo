package com.whr.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.whr.pojo.User;

@Controller
@RequestMapping("th")
public class ThymeleafController {

//	@Autowired
//	private Resource resource;
	
	@RequestMapping("test")
	public String test(ModelMap map){
		User user = new User();
		user.setName("superadmin");
		user.setPassword("111111");
		user.setAge(18);
		user.setBirthday(new Date());
		user.setDesc("<font color='red'><b>Hello</b></font>");
		map.addAttribute(user);
		
		User user1 = new User();
		user1.setName("lee");
		user1.setPassword("222222");
		user1.setAge(15);
		user1.setBirthday(new Date());
		
		User user2 = new User();
		user2.setName("manager");
		user2.setPassword("333333");
		user2.setAge(22);
		user2.setBirthday(new Date());
		List<User> userList = new ArrayList<>();
		userList.add(user);
		userList.add(user1);
		userList.add(user2);
		
		//System.out.println(userList);
		map.addAttribute("userList",userList);
		return "thymeleaf/test";
	}
	
	@RequestMapping("/index")
	public String index(ModelMap map){
		map.addAttribute("name","ABC");
		return "thymeleaf/index";
	}
	
	@RequestMapping("login")
	public String login(){
		
		return "thymeleaf/center/login";
	}
	
	@RequestMapping("postform")
	public String postform(User user){
		System.out.println("姓名: " + user.getName());
		System.out.println("年龄: " + user.getAge());
		return "redirect:/th/test";
	}
}
