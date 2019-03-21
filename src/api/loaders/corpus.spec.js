import ezs from 'ezs';
import from from 'from';

// This test queries the ISTEX API, I don't know if I let it here
// Two choices:
// 1. remove this test
// 2. mock the API
describe.skip('corpus.ini', () => {
    it('should parse a .corpus', done => {
        const res = [];
        const expected = [
            {
                ark: ['ark:/67375/M70-PTX2P60Q-H'],
                arkIstex: 'ark:/67375/M70-PTX2P60Q-H',
                articleId: ['10.1177_004724418301305203'],
                author: [
                    {
                        affiliations: ['University of Reading'],
                        name: 'Geoffrey Strickland',
                    },
                ],
                'categories/scienceMetrix': [
                    '1 - economic & social sciences',
                    '2 - social sciences',
                    '3 - cultural studies',
                ],
                'categories/scopus': [
                    '1 - Social Sciences',
                    '2 - Arts and Humanities',
                    '3 - Arts and Humanities (miscellaneous)',
                ],
                'categories/wos': [],
                copyrightDate: '1983',
                corpusName: 'sage',
                description:
                    'Queries set showing how to create an ISTEX corpus loadable into lodex',
                doi: ['10.1177/004724418301305203'],
                'enrichments/multicat': [
                    {
                        extension: 'tei',
                        mimetype: 'application/tei+xml',
                        original: false,
                        uri:
                            'https://api.istex.fr/document/F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483/enrichments/multicat',
                    },
                ],
                'enrichments/teeft': [
                    {
                        extension: 'tei',
                        mimetype: 'application/tei+xml',
                        original: false,
                        uri:
                            'https://api.istex.fr/document/F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483/enrichments/teeft',
                    },
                ],
                'enrichments/unitex': [
                    {
                        extension: 'tei',
                        mimetype: 'application/tei+xml',
                        original: false,
                        uri:
                            'https://api.istex.fr/document/F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483/enrichments/unitex',
                    },
                ],
                fulltext: [
                    {
                        extension: 'pdf',
                        mimetype: 'application/pdf',
                        original: true,
                        uri:
                            'https://api.istex.fr/document/F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483/fulltext/pdf',
                    },
                    {
                        extension: 'zip',
                        mimetype: 'application/zip',
                        original: false,
                        uri:
                            'https://api.istex.fr/document/F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483/fulltext/zip',
                    },
                    {
                        extension: 'tei',
                        mimetype: 'application/tei+xml',
                        original: false,
                        uri:
                            'https://api.istex.fr/document/F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483/fulltext/tei',
                    },
                    {
                        extension: 'txt',
                        mimetype: 'text/plain',
                        original: false,
                        uri:
                            'https://api.istex.fr/document/F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483/fulltext/txt',
                    },
                ],
                genre: ['research-article'],
                'host/eissn': ['1740-2379'],
                'host/genre': ['journal'],
                'host/issn': ['0047-2441'],
                'host/issue': '52',
                'host/language': ['unknown'],
                'host/pages/first': '289',
                'host/pages/last': '307',
                'host/publisherId': ['JES'],
                'host/title': 'Journal of european studies',
                'host/volume': '13',
                id: 'F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483',
                'keywords/teeft': [
                    'zola',
                    'valles',
                    'vingtras',
                    'maupassant',
                    'comme',
                    'atrocity',
                    'paris commune',
                    'commune',
                    'miner',
                    'prussian',
                    'walter redfern',
                    'upper window',
                    'paul lidsky',
                    'george sand',
                    'prussian invasion',
                    'french militarism',
                    'bardee toute',
                    'roland barthes',
                    'republican minority',
                    'regular army',
                    'deliberate confusion',
                    'overall effect',
                    'armee noire',
                    'same time',
                    'contemporary reader',
                    'first readers',
                    'contemporary world',
                    'second empire',
                    'national guard',
                    'sont morts',
                    'literary immortality',
                    'french contemporaries',
                    'imaginative writers',
                    'other people',
                    'henri marrou',
                    'maurice levasseur',
                ],
                language: ['eng'],
                licence: 'CC-By',
                metadata: [
                    {
                        extension: 'xml',
                        mimetype: 'application/xml',
                        original: true,
                        uri:
                            'https://api.istex.fr/document/F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483/metadata/xml',
                    },
                    {
                        extension: 'mods',
                        mimetype: 'application/mods+xml',
                        original: false,
                        uri:
                            'https://api.istex.fr/document/F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483/metadata/mods',
                    },
                    {
                        extension: 'json',
                        mimetype: 'application/json',
                        original: false,
                        uri:
                            'https://api.istex.fr/document/F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483/metadata/json',
                    },
                ],
                'namedEntities/unitex/bibl': [],
                'namedEntities/unitex/date': [
                    '1871',
                    '18s',
                    '1880s',
                    '1883',
                    '1832',
                    '1872',
                    '1848',
                    'the nineteenth century',
                    '1884',
                    '1983',
                    '1880',
                    '1860s',
                    '1885',
                    '1892',
                    '1830',
                    'the sixteenth century',
                ],
                'namedEntities/unitex/geogName': [],
                'namedEntities/unitex/orgName': ['National Guard'],
                'namedEntities/unitex/orgName_funder': [],
                'namedEntities/unitex/orgName_provider': [],
                'namedEntities/unitex/persName': [
                    'M. Zola',
                    'Kropotkin',
                    'La Deb',
                    'Henri Marrou',
                    'Paris Commune',
                    'Edmond de Goncourt',
                    'Louis Malle',
                    'Jean Macquart',
                    'Jacques Damour',
                    'Even Engels',
                    'George Sand',
                    'R.H. Zakarian',
                    'Etienne Lantier',
                    'Maurice Levasseur',
                    'Sartre',
                    'J.-P. Sartre',
                    'Louis Guilloux',
                    'Gervaise de Paris',
                    'G. Lukács',
                    'Louis Napoleon',
                    'David Coppe',
                    'R. H. Zakarian',
                    'Jules Vingtras',
                    'Paul Lidsky',
                    'La Déb',
                    'Walter Redfern',
                    'Lucky Jim',
                    'Prosper Lissagaray',
                    'La Débâcle',
                    'La Rue',
                    'Max Orphul',
                    'Gervaise de Londres',
                    'Paul Alexis',
                    'Jules Valles',
                    'Jules Vallès',
                    'Roland Barthes',
                    'T.S. Eliot',
                    'Valles',
                    'Vallès',
                    'Eugene Pottier',
                ],
                'namedEntities/unitex/placeName': [
                    'Paris',
                    'Nevers',
                    'Sedan',
                    'Hiroshima',
                    'London',
                    'Passy',
                    'Versailles',
                    'Brussels',
                    'Petersbourg',
                    'Ireland',
                    'France',
                    'Lyon',
                ],
                'namedEntities/unitex/ref_bibl': ['Paris, 1970'],
                'namedEntities/unitex/ref_url': [],
                originalGenre: ['research-article'],
                publicationDate: '1983',
                publisher: 'CNRS',
                'qualityIndicators/abstractCharCount': 0,
                'qualityIndicators/abstractWordCount': 1,
                'qualityIndicators/keywordCount': 0,
                'qualityIndicators/pdfCharCount': 43036,
                'qualityIndicators/pdfPageCount': 19,
                'qualityIndicators/pdfPageSize': '371 x 589 pts',
                'qualityIndicators/pdfVersion': 1.4,
                'qualityIndicators/pdfWordCount': 7626,
                'qualityIndicators/refBibsNative': true,
                'qualityIndicators/score': 7.012,
                refBibs: [
                    {
                        host: {
                            author: [],
                            title:
                                'From the "Address of the General Couneil of the International Working Man\'s Association on the Civil War in France", in Karl Marx, The Civil War in France (Peking: Foreign Languages Press, 1966), 99.',
                        },
                    },
                    {
                        host: {
                            author: [],
                            title:
                                "F. Engels, Introduction to The Civil War in France, 14. By 1891, Engels goes on to argue, the Proudhonist idea of a decentralized state and a federation of local working men's associations survived only among the \"'radical' bourgeoisie\". It has, of course, been argued many times that, if this was so, it was because the defeat of the Commune demonstrated the impractibility of such a scheme and not, as Engels claimed, because the Commune was, in effect, committed to the idea of the unitary state.",
                        },
                    },
                    {
                        host: {
                            author: [],
                            title: 'Les Huit journées de mai',
                        },
                    },
                    {
                        host: {
                            author: [],
                            title:
                                'For a thorough examination of these questions, see J. Rougerie, Procès des Communards',
                        },
                    },
                    {
                        host: {
                            author: [],
                            title:
                                'Quoted by Paul Lidsky from Le Temps 3 October 1871, 58.',
                        },
                    },
                    {
                        host: {
                            author: [],
                            pages: {
                                first: '104',
                                last: '5',
                            },
                            title: 'S/Z',
                        },
                    },
                    {
                        host: {
                            author: [],
                            title: 'Hamlet and his problems',
                        },
                    },
                    {
                        host: {
                            author: [],
                            title:
                                "Zola's Germinal: A critical study of its primary sources",
                        },
                    },
                    {
                        host: {
                            author: [],
                            pages: {
                                first: '175',
                                last: '97',
                            },
                            title: 'See F. W. J. Hemmings, Emile Zola',
                        },
                    },
                    {
                        host: {
                            author: [],
                            pages: {
                                first: '93',
                                last: '105',
                            },
                            title: 'Balzac et le réalisme français',
                        },
                    },
                    {
                        host: {
                            author: [],
                            pages: {
                                first: '12',
                            },
                            title: 'Le Bachelier',
                        },
                    },
                    {
                        host: {
                            author: [],
                            pages: {
                                first: '621',
                            },
                            title:
                                'Essay on "Dickens romancier" in the Club Diderot edition',
                        },
                    },
                    {
                        host: {
                            author: [],
                            title: 'Barthes, op. cit. (ref. 6), 105.',
                        },
                    },
                    {
                        host: {
                            author: [],
                            pages: {
                                first: '178',
                            },
                            title: "Qu'est-ce que la littérature",
                        },
                    },
                    {
                        host: {
                            author: [],
                            pages: {
                                first: '47',
                            },
                            title: 'De la connaissance historique',
                        },
                    },
                    {
                        host: {
                            author: [],
                            title:
                                'I am thinking especially of Montaigne\'s eye-witness account of the lynching of the Lieutenant Governor of Bordeaux in 1548 in "Divers evenemens du mesme conseil" (1, XXIV), what he tells us of recent local atrocities in "De l\'expérience" (iii, XIII) and his account of the motivation of the combatants in the religious wars in the opening pages of "L\'Apologie de Raymond Sebond" (ii, XII).',
                        },
                    },
                    {
                        author: [
                            {
                                name: ' Jules Vallès',
                            },
                        ],
                        host: {
                            author: [],
                            pages: {
                                first: '808',
                            },
                            title: 'Oeuvres complètes',
                            volume: 'IV',
                        },
                        title: 'Politique et Littérature',
                    },
                    {
                        host: {
                            author: [],
                            pages: {
                                first: '694',
                            },
                            title: 'Oeuvres complètes',
                            volume: 'III',
                        },
                    },
                ],
                title:
                    'Maupassant, Zola, Jules Vallès and the Paris Commune of 1871',
                versionInfo: '1',
            },
        ];
        from([
            `#
# Corpus example
#
title       : ISTEX corpus example
author      : Nicolas
publisher   : CNRS
description : Queries set showing how to create an ISTEX corpus loadable into lodex
licence     : CC-By
versionInfo : 1

[ISTEX]
#query  "Les Châtiments"
#query  "Lucrèce Borgia"
#query  "Le Roi s'amuse"
id F6CB7249E90BD96D5F7E3C4E80CC1C3FEE4FF483
#id D8243AB8AF68D5226C3990E465CEE399E012663F
`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/corpus.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual(expected);
                done();
            });
    });
});
