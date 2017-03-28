import ezs from 'ezs';
import N3 from 'n3';
import ezsBasics from 'ezs-basics';
import * as ezsLocals from './ezsLocals';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

const prefixes = {
    bibo: 'http://purl.org/ontology/bibo/',
    bio: 'http://vocab.org/bio/0.1/',
    dbpedia: 'http://dbpedia.org/',
    dbpediaowl: 'http://dbpedia.org/ontology/',
    dbprop: 'http://dbpedia.org/property/',
    dcdoc: 'http://dublincore.org/documents/',
    dcmitype: 'http://purl.org/dc/dcmitype/',
    dcterms: 'http://purl.org/dc/terms/',
    foaf: 'http://xmlns.com/foaf/0.1/',
    frbr: 'http://rdvocab.info/uri/schema/FRBRentitiesRDA/',
    geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
    gn: 'http://www.geonames.org/ontology/ontology_v3.1.rdf/',
    ign: 'http://data.ign.fr/ontology/topo.owl/',
    insee: 'http://rdf.insee.fr/geo/',
    isni: 'http://isni.org/ontology#',
    marcrel: 'http://id.loc.gov/vocabulary/relators/',
    mo: 'http://musicontology.com/',
    og: 'http://ogp.me/ns#',
    ore: 'http://www.openarchives.org/ore/terms/',
    owl: 'http://www.w3.org/2002/07/owl#',
    prov: 'http://www.w3.org/ns/prov#',
    rdagroup1elements: 'http://rdvocab.info/Elements/',
    rdagroup2elements: 'http://rdvocab.info/ElementsGr2/',
    rdarelationships: 'http://rdvocab.info/RDARelationshipsWEMI/',
    rdarole: 'http://rdvocab.info/roles/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    schema: 'http://schema.org/',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    time: 'http://www.w3.org/TR/owl-time/',
    xfoaf: 'http://www.foafrealm.org/xfoaf/0.1/',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
};

const exporter = (fields, characteristics, stream) =>
    stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(ezs('JSONLDObject', { fields }))
        .pipe(ezs('linkDataset', {
            uri: 'http://lod.istex.fr/',
            scheme: 'http://www.w3.org/2004/02/skos/core#inScheme',
        }))
        .pipe(ezs('JSONLDString'))
        .pipe(ezs('bufferify'))
        .pipe(N3.StreamParser({ format: 'N-Quads' }))
        .pipe(new N3.StreamWriter({ prefixes }));

exporter.extension = 'ttl';
exporter.mimeType = 'text/turtle';

export default exporter;
