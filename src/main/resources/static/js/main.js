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
        async executeQuery() {
            const query = this.getSelectedQuery();
            if (!query) {
                this.error = 'SQLクエリを入力してください。';
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