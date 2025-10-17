// @ts-expect-error TS(2792): Cannot find module 'xml-writer'. Did you mean to s... Remove this comment to see the full error message
import XMLWriter from 'xml-writer';

export default function convertToSitemap(this: any, data: any, feed: any) {
    if (this.isLast()) {
        if (this.xw) {
            this.xw.endElement();
            this.xw.endDocument();
            feed.write(this.xw.toString());
        }
        return feed.close();
    }
    if (this.isFirst()) {
        this.xw = new XMLWriter(false);
        this.xw.startDocument();
        this.xw.startElement('urlset');
        this.xw.writeAttribute(
            'xmlns',
            'http://www.sitemaps.org/schemas/sitemap/0.9',
        );
    }
    this.xw.startElement('url');
    this.xw.startElement('loc').text(data.uri).endElement();
    this.xw
        .startElement('lastmod')
        .text(data.publicationDate.toString())
        .endElement();
    this.xw.startElement('changefreq').text('monthly').endElement();
    this.xw.startElement('priority').text('1').endElement();
    this.xw.endElement();
    return feed.end();
}
