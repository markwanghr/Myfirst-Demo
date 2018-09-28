/*package com.whr.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.whr.dao.AccountDao;
import com.whr.pojo.Account;
import com.whr.service.imp.IAccountService;

public class AccountService implements IAccountService {

	//注入AccountDao
	@Autowired
	private AccountDao accountDao;
	@Override
	public void add(Account account) {
		accountDao.add(account);
		
	}

	@Override
	public void update(Account account) {
		accountDao.update(account);
		
	}

	@Override
	public void delete(int id) {
		accountDao.delete(id);
		
	}

	@Override
	public Account queryById(int id) {
		return accountDao.queryById(id);
	}

	@Override
	public List<Account> queryAll() {
		accountDao.queryAll();
		return accountDao.queryAll();
	}

	
}
*/