package com.whr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.whr.pojo.Resource;

@Controller
@RequestMapping("ftl")
public class FreemarkController {

	@Autowired
	private Resource resource;
	
	@RequestMapping("index")
	public String index(ModelMap map){
		map.addAttribute(resource);
		return "freemarker/index";
	}
	
	@RequestMapping("login")
	public String login(){
		
		return "freemarker/center/login";
	}
}
