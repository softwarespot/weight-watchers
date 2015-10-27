package com.softala.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.softala.bean.Weight;

/**
 * Class for mapping database rows to object
 * 
 * @author InkaH
 */
public class WeightRowMapper implements RowMapper<Weight> {

	public Weight mapRow(ResultSet resultSet, int rowNum) throws SQLException {
		Weight weight = new Weight();
		weight.setId(resultSet.getInt("id"));
		weight.setValue(resultSet.getFloat("value"));
		weight.setTime(resultSet.getTimestamp("time"));
		weight.setUsername(resultSet.getString("username"));

		return weight;
	}
}