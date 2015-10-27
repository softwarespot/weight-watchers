package com.softala.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.softala.bean.Weight;
import com.softala.dao.WeightDao;
import com.softala.dao.WeightRowMapper;

/**
 * Class implementing the WeightDAO interface
 * 
 * @author InkaH and SoftwareSpot
 */
@Component
public class WeightDaoImpl implements WeightDao {

	@Inject
	private JdbcTemplate _jdbcTemplate;

	/**
	 * Get the JDBC template object reference
	 * 
	 * @return JDBC template object reference
	 */
	public JdbcTemplate getJdbcTemplate() {
		return _jdbcTemplate;
	}

	/**
	 * Get a list of unique usernames
	 * 
	 * @return A list of all unique usernames
	 */
	public List<String> getUsersAll() {
		String sql = "SELECT DISTINCT username FROM Weights";
		List<Map<String, Object>> rows = getJdbcTemplate().queryForList(sql);
		List<String> usernames = new ArrayList<String>();
		for (Map<String, Object> row : rows) {
			usernames.add((String) row.get("username"));
		}

		return usernames;
	}

	/**
	 * Returns a list of Weight objects of all database records that match the
	 * condition given as a parameter
	 *
	 * @param username
	 *            Specifies the condition by which the database records are
	 *            filtered
	 * @return A list of Weight objects
	 */
	public List<Weight> getUserWeights(String username) {
		String sql = "SELECT * FROM Weights WHERE username = ?";
		Object[] parameters = new Object[] { username };
		RowMapper<Weight> mapper = new WeightRowMapper();
		List<Weight> weights = null;
		try {
			weights = getJdbcTemplate().query(sql, parameters, mapper);
		} catch (DataAccessException e) {
			//return null, controller handles the setting of http status to NOT_FOUND when it gets a null returned
			return null;
		}
		return weights;
	}

	/**
	 * Get a Weight object based on an id
	 * 
	 * @param id
	 *            Id of the Weight object
	 * 
	 * @return Weight object reference; otherwise, null
	 */
	public Weight getWeightById(int id) {
		String sql = "SELECT * FROM Weights WHERE id = ?";
		Object[] parameters = new Object[] { id };
		RowMapper<Weight> mapper = new WeightRowMapper();

		Weight weight = null;
		try {
			weight = (Weight) getJdbcTemplate().queryForObject(sql, parameters, mapper);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}

		return weight;
	}

	/**
	 * Returns a list of Weight objects of all database records
	 *
	 * @return An list of Weight objects
	 */
	public List<Weight> getWeightsAll() {
		String sql = "SELECT * FROM Weights";
		RowMapper<Weight> mapper = new WeightRowMapper();
		List<Weight> weights = getJdbcTemplate().query(sql, mapper);

		return weights;
	}

	/**
	 * Inserts the value, time and username attributes of the Weight object into
	 * the database
	 *
	 * @param weight
	 *            Weight object
	 */
	public void saveWeight(Weight weight) {
		// Note that weight.getTime() is ignored and the SQL function NOW() is
		// used instead
		String sql = "INSERT INTO Weights(value, time, username) VALUES (?, NOW(), ?)";
		Object[] parameters = new Object[] { weight.getValue(), weight.getUsername() };
		getJdbcTemplate().update(sql, parameters);
	}
	
	/**
	 * Deletes a weight record from database based on its id.
	 * 
	 * @param id
	 *  		  Id of the Weight object
	 */
	public boolean deleteWeight(int id){
		String sql = "DELETE FROM Weights WHERE id = ?";
		Object[] parameters = new Object[]{id};
		try {
			getJdbcTemplate().update(sql, parameters);
		} catch (DataAccessException e) {
			return false;
		}
		return true;
	}

	/**
	 * Set the JDBC template object reference
	 * 
	 * @param jdbcTemplate
	 *            JDBC template object reference to set with
	 */
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this._jdbcTemplate = jdbcTemplate;
	}
}
