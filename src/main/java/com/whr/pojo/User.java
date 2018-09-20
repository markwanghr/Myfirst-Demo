package com.whr.pojo;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

public class User {
	private String name;
	@JsonIgnore    //忽略属性的输出
	private String password;
	private int age;
	@JsonInclude(Include.NON_NULL)  //属性为空时，忽略输出
	private String Desc;
	@JsonFormat(pattern="yyyy/mm/dd hh:mm:ss a",locale="zh",timezone="GMT+8")
	private Date birthday;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public String getDesc() {
		return Desc;
	}
	public void setDesc(String desc) {
		Desc = desc;
	}
	public Date getBirthday() {
		return birthday; 
	}
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}
	@Override
	public String toString() {
		return "User [name=" + name + ", password=" + password + ", age=" + age + ", Desc=" + Desc + ", birthday="
				+ birthday + "]";
	}
	
	
}
