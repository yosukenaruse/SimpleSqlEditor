package com.simple.sql.editor.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

@Mapper
public interface SqlMapper {
    List<Map<String, Object>> executeQuery(String sql);
    List<Map<String, Object>> getQueryHistory();
    void saveQueryHistory(String sql, String status, String errorMessage, long duration);
} 