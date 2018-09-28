package com.whr.pojo;

import javax.persistence.*;

public class Account {
    @Id
    @Column(name = "accId")
    private Integer accid;

    @Column(name = "accName")
    private String accname;

    private String desc;

    private Double money;

    /**
     * @return accId
     */
    public Integer getAccid() {
        return accid;
    }

    /**
     * @param accid
     */
    public void setAccid(Integer accid) {
        this.accid = accid;
    }

    /**
     * @return accName
     */
    public String getAccname() {
        return accname;
    }

    /**
     * @param accname
     */
    public void setAccname(String accname) {
        this.accname = accname;
    }

    /**
     * @return desc
     */
    public String getDesc() {
        return desc;
    }

    /**
     * @param desc
     */
    public void setDesc(String desc) {
        this.desc = desc;
    }

    /**
     * @return money
     */
    public Double getMoney() {
        return money;
    }

    /**
     * @param money
     */
    public void setMoney(Double money) {
        this.money = money;
    }
}