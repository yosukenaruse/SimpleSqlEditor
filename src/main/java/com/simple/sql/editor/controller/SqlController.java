package com.simple.sql.editor.controller;

import com.simple.sql.editor.service.SqlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/sql")
public class SqlController {

    @Autowired
    private SqlService sqlService;

    @PostMapping("/execute")
    public Map<String, Object> executeQuery(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String sql = request.get("sql");
            if (sql == null) {
                response.put("error", "クエリが指定されていません。");
                return response;
            }
            
            List<Map<String, Object>> results = sqlService.executeQuery(sql);
            response.put("results", results);
        } catch (IllegalArgumentException e) {
            response.put("error", e.getMessage());
        } catch (Exception e) {
            response.put("error", "クエリの実行中にエラーが発生しました: " + e.getMessage());
        }
        return response;
    }

    @PostMapping("/plan")
    public Map<String, Object> getExecutionPlan(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String sql = request.get("sql");
            if (sql == null) {
                response.put("error", "クエリが指定されていません。");
                return response;
            }

            if (!sql.trim().toLowerCase().startsWith("select")) {
                response.put("error", "実行計画はSELECT文のみ取得可能です");
                return response;
            }

            List<Map<String, Object>> planResults = sqlService.executeQuery("EXPLAIN QUERY PLAN " + sql);
            StringBuilder planBuilder = new StringBuilder();
            for (Map<String, Object> row : planResults) {
                planBuilder.append(row.values().stream()
                    .map(Object::toString)
                    .reduce((a, b) -> a + " | " + b)
                    .orElse(""));
                planBuilder.append("\n");
            }
            response.put("plan", planBuilder.toString().trim());
        } catch (IllegalArgumentException e) {
            response.put("error", e.getMessage());
        } catch (Exception e) {
            response.put("error", "実行計画の取得中にエラーが発生しました: " + e.getMessage());
        }
        return response;
    }
} 