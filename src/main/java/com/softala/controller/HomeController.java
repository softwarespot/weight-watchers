package com.softala.controller;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.softala.bean.Weight;
import com.softala.dao.WeightDaoImpl;

@Controller
@RequestMapping(value = "/")
public class HomeController {

	/**
	 * Logging factory method
	 */
	private static final Logger _logger = LoggerFactory.getLogger(HomeController.class);
	
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
	 * Get the weight data access object
	 * 
	 * @return Weight data access object
	 */
	public WeightDaoImpl getDao() {
		return _dao;
	}

	/**
	 * Fetches a list of all weights from the database
	 *
	 * @param mapModel
	 *            List of all weights from the database
	 * @return Index view
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String getIndex(Map<String, Object> mapModel) {
		List<Weight> weights = getDao().getWeightsAll();
		getLogger().info("Index view", weights);

		// Add to the view model which will be used in the index.jsp view
		mapModel.put("weights", weights);

		return "index";
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