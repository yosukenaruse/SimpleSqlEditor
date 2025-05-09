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
        async executeQuery() {
            if (!this.sqlQuery) {
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
                    body: JSON.stringify({ query: this.sqlQuery })
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