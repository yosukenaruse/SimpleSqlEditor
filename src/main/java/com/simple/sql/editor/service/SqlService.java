package com.simple.sql.editor.service;

import com.simple.sql.editor.mapper.SqlMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class SqlService {

    @Autowired
    private SqlMapper sqlMapper;

    public List<Map<String, Object>> executeQuery(String query) {
        return sqlMapper.executeQuery(query);
    }
} 