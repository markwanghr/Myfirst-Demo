package com.whr;

//import org.mybatis.spring.annotation.MapperScan;
import tk.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
//扫描mybatis mapper包的路径
@MapperScan(basePackages = "com.whr.mapper")
//扫描所有的包，包括一些自用的工具类包所在的路径
//@ComponentScan(basePackages = {"com.whr"})
public class UserApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserApplication.class, args);
	}
}
