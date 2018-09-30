package com.whr.service.imp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.whr.mapper.AccountMapper;
import com.whr.pojo.Account;
import com.whr.service.IAccountService;


@Service
public class AccountService implements IAccountService {

	//注入AccountDao
	@Autowired
	private AccountMapper accMapper;
	@Override
	public void add(Account account) throws Exception{
		accMapper.insert(account);
		
	}

	@Override
	public void update(Account account) {
//		accMapper.updateByPrimaryKeySelective(account);
		accMapper.updateByPrimaryKey(account);
		
	}

	@Override
	public void delete(int id) {
		accMapper.deleteByPrimaryKey(id);
		
	}

	@Override
	public Account queryById(int id) {
		return accMapper.selectByPrimaryKey(id);
	}

	@Override
	public List<Account> queryAll() {
		List<Account> list = accMapper.selectAll();
		if (list.size() > 0) {
			return list;
		}else{
			return null;
		}
	}

	
}
