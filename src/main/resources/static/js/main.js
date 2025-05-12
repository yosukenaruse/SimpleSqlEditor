const { createApp } = Vue;

createApp({
    data() {
        return {
            sqlQuery: '',
            results: [],
            error: null,
            isLoading: false,
            tableHeaders: []
        }
    },
    methods: {
        getSelectedQuery() {
            const textarea = document.getElementById('sql-input');
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            
            // 範囲選択がある場合は選択されたテキストを返す
            if (start !== end) {
                return this.sqlQuery.substring(start, end);
            }
            
            // 範囲選択がない場合は全体のテキストを返す
            return this.sqlQuery;
        },
        validateQuery(query) {
            // クエリを大文字に変換して検証
            const upperQuery = query.trim().toUpperCase();
            
            // UPDATE文のチェック
            if (upperQuery.startsWith('UPDATE')) {
                return 'UPDATE文は使用できません。';
            }
            
            // INSERT文のチェック
            if (upperQuery.startsWith('INSERT')) {
                return 'INSERT文は使用できません。';
            }
            
            // DELETE文のチェック
            if (upperQuery.startsWith('DELETE')) {
                return 'DELETE文は使用できません。';
            }
            
            // ALTER文のチェック
            if (upperQuery.startsWith('ALTER')) {
                return 'ALTER文は使用できません。';
            }
            
            // DROP文のチェック
            if (upperQuery.startsWith('DROP')) {
                return 'DROP文は使用できません。';
            }
            
            // CREATE文のチェック
            if (upperQuery.startsWith('CREATE')) {
                return 'CREATE文は使用できません。';
            }
            
            return null;
        },
        async executeQuery() {
            const query = this.getSelectedQuery();
            if (!query) {
                this.error = 'SQLクエリを入力してください。';
                return;
            }

            // クエリのバリデーション
            const validationError = this.validateQuery(query);
            if (validationError) {
                this.error = validationError;
                return;
            }

            this.isLoading = true;
            this.error = null;
            this.results = [];

            try {
                const response = await fetch('/api/sql/execute', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: query })
                });

                const data = await response.json();
                
                if (data.error) {
                    this.error = data.error;
                } else {
                    this.results = data.results;
                    if (this.results.length > 0) {
                        this.tableHeaders = Object.keys(this.results[0]);
                    }
                }
            } catch (error) {
                this.error = `エラーが発生しました: ${error.message}`;
            } finally {
                this.isLoading = false;
            }
        }
    }
}).mount('#app'); 