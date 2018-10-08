package com.whr.service.imp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.whr.mapper.AccountMapper;
import com.whr.pojo.Account;
import com.whr.service.IAccountService;


@Service
public class AccountService implements IAccountService {

	//注入AccountDao
	@Autowired
	private AccountMapper accMapper;//这里也可注入自定义的mapper，用于对数据库的操作
	
	@Override
	@Transactional(propagation = Propagation.REQUIRED)
	public void add(Account account) throws Exception{
		accMapper.insert(account);
		
	}

	@Override
	@Transactional(propagation = Propagation.REQUIRED)
	public void update(Account account) {
		accMapper.updateByPrimaryKeySelective(account);//只更新字段改变的
//		accMapper.updateByPrimaryKey(account);
		
	}

	@Override
	@Transactional(propagation = Propagation.REQUIRED)
	public void delete(int id) {
		accMapper.deleteByPrimaryKey(id);
		
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public Account queryById(int id) {
		return accMapper.selectByPrimaryKey(id);
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public List<Account> queryAll() {
		List<Account> list = accMapper.selectAll();
		if (list != null && list.size() > 0) {
			return list;
		}else{
			return null;
		}
	}

	
}
