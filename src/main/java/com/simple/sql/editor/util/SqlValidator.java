package com.simple.sql.editor.util;

import org.springframework.stereotype.Component;

@Component
public class SqlValidator {
    
    public void validateQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("SQLクエリが空です。");
        }

        String upperQuery = query.trim().toUpperCase();
        
        // 禁止されているSQL文のチェック
        if (upperQuery.startsWith("UPDATE")) {
            throw new IllegalArgumentException("UPDATE文は使用できません。");
        }
        
        if (upperQuery.startsWith("INSERT")) {
            throw new IllegalArgumentException("INSERT文は使用できません。");
        }
        
        if (upperQuery.startsWith("DELETE")) {
            throw new IllegalArgumentException("DELETE文は使用できません。");
        }
        
        if (upperQuery.startsWith("ALTER")) {
            throw new IllegalArgumentException("ALTER文は使用できません。");
        }
        
        if (upperQuery.startsWith("DROP")) {
            throw new IllegalArgumentException("DROP文は使用できません。");
        }
        
        if (upperQuery.startsWith("CREATE")) {
            throw new IllegalArgumentException("CREATE文は使用できません。");
        }
        
        if (upperQuery.startsWith("TRUNCATE")) {
            throw new IllegalArgumentException("TRUNCATE文は使用できません。");
        }
    }
} 