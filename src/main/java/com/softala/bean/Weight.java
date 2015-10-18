package com.softala.bean;

import java.util.Date;

public interface Weight {
	
	public abstract int getId();
	
	public abstract Date getTime();
	
	public abstract String getUsername();
	
	public abstract float getValue();
	
	public abstract void setId(int id);
	
	public abstract void setTime(Date time);
	
	public abstract void setUsername(String username);	
	
	public abstract void setValue(float value);

}
