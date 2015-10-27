package com.softala.dao;

import java.util.List;

import com.softala.bean.Weight;

/**
 * DAO interface for Weight bean
 * 
 * @author InkaH and SoftwareSpot
 */
public interface WeightDao {

	public abstract List<String> getUsersAll();
	
	public abstract List<Weight> getUserWeights(String username);
	
	public abstract Weight getWeightById(int id);
	
	public abstract List<Weight> getWeightsAll();
	
	public abstract boolean saveWeight(Weight weight);
	
	public abstract boolean deleteWeight(int id);
}
