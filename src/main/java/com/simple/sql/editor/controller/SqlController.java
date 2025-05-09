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
            String query = request.get("query");
            List<Map<String, Object>> results = sqlService.executeQuery(query);
            response.put("results", results);
        } catch (Exception e) {
            response.put("error", e.getMessage());
        }
        return response;
    }
} 