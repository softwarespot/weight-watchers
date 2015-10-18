// Useful guide(s):
// http://spring.io/guides/gs/rest-service/
// http://spring.io/guides/tutorials/bookmarks/
// http://www.leveluplunch.com/java/tutorials/014-post-json-to-spring-rest-webservice/

package com.softala.controller;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.softala.bean.Weight;
import com.softala.dao.WeightDaoImpl;

/**
 * Handles requests for the API
 *
 * @author SoftwareSpot
 */
@RestController
@RequestMapping(value = "/api")
public class ApiController {

	/**
	 * Logging factory method
	 */
	private static final Logger _logger = LoggerFactory.getLogger(ApiController.class);

	/**
	 * Get the logger object reference
	 * 
	 * @return The logger object reference
	 */
	public static Logger getLogger() {
		return _logger;
	}

	/**
	 * Weight data access object
	 */
	@Inject
	private WeightDaoImpl _dao;

	/**
	 *
	 * @param username
	 *            Username of the user
	 * @param weight
	 *            weight value object
	 * @return CREATED (201) otherwise, NOT_FOUND (404) if the username doesn't
	 *         exist
	 */
	@RequestMapping(value = "users/{username}/weights", method = RequestMethod.POST)
	ResponseEntity<?> addWeightByUser(@PathVariable String username, @RequestBody Weight weight) {
		getLogger().info("users/{username}/weights aka addWeightByUser");

		// Check if the username already exists in the database and if it
		// doesn't return with a NOT_FOUND HTTP status code
		if (!getDao().getUsersAll().contains(username)) {
			return new ResponseEntity<Object>(null, HttpStatus.NOT_FOUND);
		}

		// Add to the database. Note: There is not error checking done
		// beforehand
		getDao().saveWeight(weight);

		return new ResponseEntity<Object>(null, HttpStatus.CREATED);
	}

	/**
	 * Get the weight data access object
	 * 
	 * @return Weight data access object
	 */
	public WeightDaoImpl getDao() {
		return _dao;
	}

	/**
	 * Get a JSON array of all users
	 *
	 * @return Response entity of users, that are serialized to JSON
	 */
	@RequestMapping(value = "/users", method = RequestMethod.GET, produces = "application/json")
	ResponseEntity<?> getUsersAll() {
		getLogger().info("api/users aka getUsersAll");

		// Get a list of all unique usernames
		List<String> usernames = getDao().getUsersAll();

		// Check if the usernames list is empty and if it is, return a NOT_FOUND
		// HTTP status code
		if (usernames.isEmpty()) {
			return new ResponseEntity<Object>(null, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<List<String>>(usernames, HttpStatus.OK);
	}

	/**
	 * Get a JSON object of a weight value object by id
	 *
	 * @param id
	 *            Id of the weight value object
	 * @return Response entity of a weight value object, that is serialized to
	 *         JSON
	 */
	@RequestMapping(value = "/weights/{id}", method = RequestMethod.GET, produces = "application/json")
	ResponseEntity<?> getWeightById(@PathVariable int id) {
		getLogger().info("api/weights/{id} aka getWeightById");

		// Get the weight based on the id
		Weight weight = getDao().getWeightById(id);

		// If the weight was not found, then set the HTTP status code to
		// NOT_FOUND
		if (weight == null) {
			return new ResponseEntity<Object>(null, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<Weight>(weight, HttpStatus.OK);
	}

	/**
	 * Get a JSON array of all weight value objects
	 *
	 * @return Response entity of weight value objects, that are serialized to
	 *         JSON
	 */
	@RequestMapping(value = "/weights", method = RequestMethod.GET, produces = "application/json")
	ResponseEntity<?> getWeightsAll() {
		getLogger().info("api/weights aka getWeightsAll");

		List<Weight> weights = getDao().getWeightsAll();

		// If the weights array is empty, then set the HTTP status code to
		// NOT_FOUND
		if (weights.isEmpty()) {
			return new ResponseEntity<Object>(null, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<List<Weight>>(weights, HttpStatus.OK);
	}

	/**
	 * Get a JSON array of all weight value objects by username
	 *
	 * @param username
	 *            Username of the user
	 * @return Response entity of weight value objects, that are serialized to
	 *         JSON
	 */
	@RequestMapping(value = "/users/{username}/weights", method = RequestMethod.GET, produces = "application/json")
	ResponseEntity<?> getWeightsByUser(@PathVariable String username) {
		getLogger().info("api/users/{username}/weights aka getWeightsByUser");
		
		// Note: This should be ideally done in the DAO, but it's for testing only!

		// If the username does not exist, then set the HTTP status code to
		// NOT_FOUND
		if (!getDao().getUsersAll().contains(username)) {
			return new ResponseEntity<Object>(null, HttpStatus.NOT_FOUND);
		}

		List<Weight> weights = new ArrayList<Weight>();
		for (Weight weight : getDao().getWeightsAll()) {
			// Push the weight value object to the temporary array list
			if (weight.getUsername().equals(username)) {
				weights.add(weight);
			}
		}

		// If the weights array is empty, then set the HTTP status code to
		// NOT_FOUND
		if (weights.isEmpty()) {
			return new ResponseEntity<Object>(null, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<List<Weight>>(weights, HttpStatus.OK);
	}

	/**
	 * Set the weight data access object
	 * 
	 * @param dao
	 *            Weight data access object
	 */
	public void setDao(WeightDaoImpl dao) {
		this._dao = dao;
	}
}
