package com.simple.sql.editor.service;

import com.simple.sql.editor.mapper.SqlMapper;
import com.simple.sql.editor.util.SqlValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class SqlService {

    @Autowired
    private SqlMapper sqlMapper;
    
    @Autowired
    private SqlValidator sqlValidator;

    public List<Map<String, Object>> executeQuery(String query) {
        // クエリのバリデーション
        sqlValidator.validateQuery(query);
        
        // クエリの実行
        return sqlMapper.executeQuery(query);
    }
} 