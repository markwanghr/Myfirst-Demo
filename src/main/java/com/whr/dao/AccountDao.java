/*package com.whr.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.whr.dao.imp.IAccountDao;
import com.whr.pojo.Account;

@Repository
public class AccountDao implements IAccountDao {

	//1使用jdbcTempalte首先要注入
	@Autowired
	private JdbcTemplate jt;
	@Override
	public void add(Account account) {
		String hql = "insert into account values (?,?,?,?)";
		jt.update(hql,account.getAccId(),account.getAccName(),account.getDesc(),account.getMoney());
	}

	@Override
	public void update(Account account) {
		String hql = "update account set accName=?,desc=?,,money=? where accId=?";
		jt.update(hql,account.getAccName(),account.getDesc(),account.getMoney(),account.getAccId());

	}

	@Override
	public void delete(int id) {
		String hql = "delete from table account where accId=?";
		jt.update(hql,id);

	}

	@Override
	public Account queryById(int id) {
		String hql = "select accId,accName,desc,money from account where accId=?";
		 List<Account> list = jt.query(hql, new Object[]{id}, new BeanPropertyRowMapper(Account.class));
	        if(list!=null && list.size()>0){
	            Account account = list.get(0);
	            return account;
	        }else{
	            return null;
	        }
	}

	@Override
	public List<Account> queryAll() {
		String hql = "select accId,accName,desc,money from account";
		List<Account> list = jt.query(hql, new Object[]{}, new BeanPropertyRowMapper(Account.class));
        if(list!=null && list.size()>0){
            return list;
        }else{
            return null;
        }
	}

}
*/