import React from 'react';
import { shallow } from 'enzyme';

import Component from './Streamgraph';

describe('BubbleView', () => {
    it('should render Bubble chart', () => {
        const data = [
            {
                source: '2010',
                target: 'Pétrogenèse de roches basaltiques',
                weight: 0.9013102637325718,
            },
            {
                source: '2001',
                target: 'Pétrogenèse de roches basaltiques',
                weight: 0.5250259144084111,
            },
            {
                source: '2001',
                target:
                    "Sédiments et sédimentation marine du Quaternaire des marges de l'océan Arctique",
                weight: 0.2898711683696135,
            },
            {
                source: '2001',
                target:
                    'Activités sismique et magmatique des dorsales océaniques arctiques',
                weight: 0.09677180512364875,
            },
            {
                source: '2002',
                target: 'Droits des peuples autochtones et géopolitique',
                weight: 0.8070945945945946,
            },
            {
                source: '2002',
                target: 'Interactions ionosphère-magnétosphère',
                weight: 0.06047297297297297,
            },
            {
                source: '2011',
                target:
                    'Toxicologie et écotoxicologie des polluants  & Études de taxonomie',
                weight: 0.5175824175824176,
            },
            {
                source: '2011',
                target: 'Droits des peuples autochtones et géopolitique',
                weight: 0.22747252747252747,
            },
            {
                source: '2011',
                target: 'Dynamique des populations animales',
                weight: 0.06263736263736264,
            },
            {
                source: '2003',
                target: 'Épidémiologie des cancers',
                weight: 0.8240685984624483,
            },
            {
                source: '2003',
                target: 'Interactions ionosphère-magnétosphère',
                weight: 0.09964518036664695,
            },
            {
                source: '2012',
                target: 'Pêcheries et dynamique des stocks de poissons marins',
                weight: 0.7814697609001406,
            },
            {
                source: '2012',
                target: 'Dynamique des populations animales',
                weight: 0.0989803094233474,
            },
            {
                source: '2009',
                target: "Déplétion d'ozone stratosphérique ",
                weight: 0.40464547677261614,
            },
            {
                source: '2009',
                target: 'Biogéochimie marine et dulçaquicole',
                weight: 0.26772616136919314,
            },
            {
                source: '2009',
                target: 'Dynamique des populations animales',
                weight: 0.0745721271393643,
            },
            {
                source: '2000',
                target: 'Interactions ionosphère-magnétosphère',
                weight: 0.6458988628115171,
            },
            {
                source: '2000',
                target: 'Biogéochimie marine et dulçaquicole',
                weight: 0.27740140333897895,
            },
            {
                source: '2006',
                target:
                    'Impacts climatiques du réchauffement et rétroactions atmosphère - cryosphère',
                weight: 0.07410562180579217,
            },
            {
                source: '2006',
                target: 'Banquise, structure thermohaline et courants marins',
                weight: 0.05479840999432141,
            },
        ];
        const wrapper = shallow(<Component data={data} />);

        const bubbles = wrapper.find('Bubble');
        expect(bubbles.length).toBe(3);

        expect(bubbles.map(b => b.props())).toEqual([
            { color: 'color', name: 1, r: 10, value: 'first', x: 10, y: 10 },
            { color: 'color', name: 2, r: 20, value: 'second', x: 20, y: 20 },
            { color: 'color', name: 3, r: 30, value: 'third', x: 30, y: 30 },
        ]);
    });
});
