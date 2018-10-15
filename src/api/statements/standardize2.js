export default function standarize2(data, feed) {
    if (!this.documents) {
        this.documents = [];
    }
    if (!this.columns) {
        this.columns = [];
    }
    if (this.isLast()) {
        this.documents
            .map(d => {
                const newdoc = {};
                this.columns.forEach(k => {
                    newdoc[k] = !d[k] ? '' : d[k];
                });
                return newdoc;
            })
            .forEach(d => feed.write(d));
        feed.close();
        return;
    } else {
        Object.keys(data).forEach(k => {
            if (this.columns.indexOf(k) === -1) {
                this.columns.push(k);
            }
        });
        this.documents.push(data);
        feed.end();
    }
}
