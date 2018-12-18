import XMLWriter from 'xml-writer';

export default function convertToSitemap(data, feed) {
    if (this.isFirst()) {
        this.xw = new XMLWriter(false, string => feed.write(string));
        this.xw.startDocument();
        this.xw.startElement('urlset');
        this.xw.writeAttribute(
            'xmlns',
            'http://www.sitemaps.org/schemas/sitemap/0.9',
        );
    }
    if (this.isLast()) {
        this.xw.endElement();
        this.xw.endDocument();
        return feed.close();
    }
    this.xw.startElement('url');
    this.xw
        .startElement('loc')
        .text(data.uri)
        .endElement();
    this.xw
        .startElement('lastmod')
        .text(data.publicationDate.toString())
        .endElement();
    this.xw
        .startElement('changefreq')
        .text('monthly')
        .endElement();
    this.xw
        .startElement('priority')
        .text('1')
        .endElement();
    this.xw.endElement();
    feed.end();
}
