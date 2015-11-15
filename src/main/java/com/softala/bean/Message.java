package com.softala.bean;

/**
 * @author SoftwareSpot
 */
public class Message {
	private int status;
	private String message;

	/**
	 * Constructor
	 *
	 * @param status
	 *            Status value
	 * @param message
	 *            Message string
	 */
	public Message(int status, String message) {
		super();

		this.status = status;
		this.message = message;
	}

	public String getMessage() {
		return message;
	}

	public int getStatus() {
		return status;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public void setStatus(int status) {
		this.status = status;
	}
}
