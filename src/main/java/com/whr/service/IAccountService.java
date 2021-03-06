package com.whr.service;

import java.util.List;

import com.whr.pojo.Account;

public interface IAccountService {

	public void add(Account account) throws Exception;
	public void update(Account account);
	public void delete(int id);
	public Account queryById(int id);
	
	public List<Account> queryAll();
}
