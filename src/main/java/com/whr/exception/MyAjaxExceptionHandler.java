package com.whr.exception;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.whr.pojo.JSONResult;


@RestControllerAdvice
public class MyAjaxExceptionHandler {

	@ExceptionHandler(value = Exception.class)
	public JSONResult defaultErrorHandler(HttpServletRequest req, 
			Exception e) throws Exception {

		e.printStackTrace();
		return JSONResult.errorException(e.getMessage());
	}
}
