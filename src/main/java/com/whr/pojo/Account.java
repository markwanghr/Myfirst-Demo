package com.whr.pojo;

import javax.persistence.*;

public class Account {
    @Id
    @Column(name = "accId")
    private Integer accid;

    @Column(name = "accName")
    private String accname;

    private String description;

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
     * @return description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description
     */
    public void setDescription(String description) {
        this.description = description;
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