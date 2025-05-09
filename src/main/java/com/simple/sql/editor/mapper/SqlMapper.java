package com.simple.sql.editor.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;
import java.util.Map;

@Mapper
public interface SqlMapper {
    
    @Select("${query}")
    List<Map<String, Object>> executeQuery(String query);
} 