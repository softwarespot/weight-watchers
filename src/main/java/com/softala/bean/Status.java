package com.softala.bean;

/**
 * @author SoftwareSpot
 */
public enum Status {
	None(0), UsernameIdInvalid(1000), UsernamesEmpty(1001), WeightIdInvalid(1002), WeightsEmpty(1003), WeightsInvalid(
			1004);

	private int value;

	/**
	 * Set the enumeration integer value
	 * 
	 * @param value
	 *            Enumeration integer value
	 */
	private Status(int value) {
		this.value = value;
	}

	/**
	 * Get the enumeration integer value
	 * 
	 * @return Enumeration interger value
	 */
	public int getValue() {
		return value;
	}
}
