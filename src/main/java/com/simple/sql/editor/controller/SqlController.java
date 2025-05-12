package com.simple.sql.editor.controller;

import com.simple.sql.editor.service.SqlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> executeQuery(@RequestBody Map<String, String> request) {
        try {
            String sql = request.get("sql");
            if (sql == null || sql.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "クエリが指定されていません。"));
            }

            // クエリの実行と履歴の保存
            Map<String, Object> result = sqlService.executeQueryAndSaveHistory(sql);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/plan")
    public ResponseEntity<?> getExecutionPlan(@RequestBody Map<String, String> request) {
        try {
            String sql = request.get("sql");
            if (sql == null || sql.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "クエリが指定されていません。"));
            }

            if (!sql.trim().toUpperCase().startsWith("SELECT")) {
                return ResponseEntity.badRequest().body(Map.of("error", "実行計画はSELECT文のみ使用できます。"));
            }

            String plan = sqlService.getExecutionPlan(sql);
            return ResponseEntity.ok(Map.of("plan", plan));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getQueryHistory() {
        try {
            List<Map<String, Object>> history = sqlService.getQueryHistory();
            return ResponseEntity.ok(Map.of("history", history));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 