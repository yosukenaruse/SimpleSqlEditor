const { createApp } = Vue;

createApp({
    data() {
        return {
            sqlQuery: '',
            results: [],
            tableHeaders: [],
            error: null,
            isLoading: false,
            executionPlan: null
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
            console.log('XXXXXX');
            this.isLoading = true
            this.error = null
            this.results = []
            this.tableHeaders = []
            this.executionPlan = null

            try {
                const response = await fetch('/api/sql/execute', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sql: this.sqlQuery })
                })

                const data = await response.json()
                if (!response.ok) {
                    throw new Error(data.message || 'エラーが発生しました')
                }
                console.log(data);
                if (data.results && data.results.length > 0) {
                    this.results = data.results
                    this.tableHeaders = Object.keys(data.results[0])
                }
            } catch (error) {
                this.error = error.message
                console.log(3333333);
                console.log(error.message);
            } finally {
                this.isLoading = false
            }
        },
        async showExecutionPlan() {
            this.isLoading = true
            this.error = null
            this.results = []
            this.tableHeaders = []
            this.executionPlan = null
            console.log(555555);
            try {
                const response = await fetch('/api/sql/plan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sql: this.sqlQuery })
                })

                const data = await response.json()
                console.log(data);
                if (!response.ok) {
                    throw new Error(data.message || 'エラーが発生しました')
                }

                this.executionPlan = data.plan
            } catch (error) {
                this.error = error.message
                console.log(error);
            } finally {
                this.isLoading = false
            }
        }
    }
}).mount('#app'); 