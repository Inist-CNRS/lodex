export default function DataObject(data, feed) {
    const indent = this.getParam('indent', false);
    let output = '';
    if (this.isFirst()) {
        output = '{"data":[';
    } else {
        output = ',\n';
    }
    if (!this.isLast()) {
        feed.write(output.concat(JSON.stringify(data, null, indent ? '    ' : null)));
    } else if (this.isLast() && this.getIndex() > 0) {
        const total = this.getIndex();
        feed.write(`], "total": ${total}}`);
        feed.close();
    } else {
        feed.write('{"total": 0}');
        feed.close();
    }
    feed.end();
}
