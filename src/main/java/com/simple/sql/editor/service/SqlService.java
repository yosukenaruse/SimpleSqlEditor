package com.simple.sql.editor.service;

import com.simple.sql.editor.mapper.SqlMapper;
import com.simple.sql.editor.util.SqlValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class SqlService {

    @Autowired
    private SqlMapper sqlMapper;
    
    @Autowired
    private SqlValidator sqlValidator;

    @Transactional
    public Map<String, Object> executeQueryAndSaveHistory(String sql) {
        sqlValidator.validateQuery(sql);

        long startTime = System.currentTimeMillis();
        String status = "SUCCESS";
        String errorMessage = null;
        List<Map<String, Object>> results = null;

        try {
            results = sqlMapper.executeQuery(sql);
        } catch (Exception e) {
            status = "ERROR";
            errorMessage = e.getMessage();
            throw e;
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            sqlMapper.saveQueryHistory(sql, status, errorMessage, duration);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("results", results);
        return response;
    }

    public String getExecutionPlan(String sql) {
        sqlValidator.validateQuery(sql);

        List<Map<String, Object>> planResults = sqlMapper.executeQuery("EXPLAIN QUERY PLAN " + sql);
        StringBuilder planBuilder = new StringBuilder();
        for (Map<String, Object> row : planResults) {
            planBuilder.append(row.values().stream()
                .map(Object::toString)
                .reduce((a, b) -> a + " | " + b)
                .orElse(""));
            planBuilder.append("\n");
        }
        return planBuilder.toString().trim();
    }

    public List<Map<String, Object>> getQueryHistory() {
        return sqlMapper.getQueryHistory();
    }
} 