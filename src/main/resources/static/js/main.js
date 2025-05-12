const { createApp } = Vue;

createApp({
    data() {
        return {
            sqlQuery: '',
            results: [],
            tableHeaders: [],
            error: null,
            isLoading: false,
            executionPlan: null,
            queryHistory: null
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
            this.tableHeaders = [];
            this.executionPlan = null;
            this.queryHistory = null;

            try {
                const response = await fetch('/api/sql/execute', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sql: query })
                });

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }

                if (data.results && data.results.length > 0) {
                    this.results = data.results;
                    this.tableHeaders = Object.keys(data.results[0]);
                }
            } catch (error) {
                this.error = error.message;
            } finally {
                this.isLoading = false;
            }
        },
        async showExecutionPlan() {
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
            this.tableHeaders = [];
            this.executionPlan = null;
            this.queryHistory = null;

            try {
                const response = await fetch('/api/sql/plan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sql: query })
                });

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }

                this.executionPlan = data.plan;
            } catch (error) {
                this.error = error.message;
            } finally {
                this.isLoading = false;
            }
        },
        async showQueryHistory() {
            this.isLoading = true;
            this.error = null;
            this.results = [];
            this.tableHeaders = [];
            this.executionPlan = null;
            this.queryHistory = null;

            try {
                const response = await fetch('/api/sql/history');
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }

                this.queryHistory = data.history;
            } catch (error) {
                this.error = error.message;
            } finally {
                this.isLoading = false;
            }
        },
        loadQuery(query) {
            this.sqlQuery = query;
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    }
}).mount('#app'); 