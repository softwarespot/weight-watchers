package com.softala.bean;

import java.util.Date;

/**
 * @author SoftwareSpot
 */
public class Weight {
	private int id;
	private float value;
	private Date time;
	private String username;

	public Weight() {
		super();
	}

	/**
	 * Constructor
	 *
	 * @param id
	 *            Database AUTO_INCREMENT id
	 * @param value
	 *            Weight value
	 * @param time
	 *            Date and time the weight value was created
	 * @param username
	 *            Username of the user who created the weight value
	 */
	public Weight(int id, float value, Date time, String username) {
		super();

		this.id = id;
		this.value = value;
		this.time = time;
		this.username = username;
	}
	
	/*
	 * Getters
	 */

	public int getId() {
		return id;
	}

	public Date getTime() {
		return time;
	}

	public String getUsername() {
		return username;
	}

	public float getValue() {
		return value;
	}
	
	/*
	 * Setters
	 */

	public void setId(int id) {
		this.id = id;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setValue(float value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return String.format("%d, %.1f, %d, %s", id, value, time.getTime(), username);
	}

}
