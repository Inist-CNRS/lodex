import Path from 'path';
import fs from 'fs';
import ezs from '@ezs/core';
import URL from 'url';
import fetch from 'fetch-with-proxy';
import config from '../../../config.json';

export default class Script {
    constructor(source, customPath = '') {
        const routineDirectory = `./${source}/`;
        const routineLocalDirectory = Path.resolve(
            __dirname,
            '../',
            customPath,
            routineDirectory,
        );
        const routinesDeclared = config[source] || [];
        const routinesLocal = routinesDeclared
            .map(routineName =>
                Path.resolve(routineLocalDirectory, routineName.concat('.ini')),
            )
            .filter(fileName => fs.existsSync(fileName))
            .map(fileName => [
                fileName,
                ezs.metaFile(fileName),
                Path.basename(fileName, '.ini'),
                fs.readFileSync(fileName).toString(),
            ]);
        const pluginsURL = config.pluginsURL || '';
        const routineRepository = URL.resolve(pluginsURL, routineDirectory);
        const routinesDistant = routinesDeclared
            .map(routineName =>
                URL.resolve(routineRepository, routineName.concat('.ini')),
            )
            .map(fileName => [
                fileName,
                null,
                Path.basename(fileName, '.ini'),
                null,
            ]);
        const cacheParameter = `${source}Cache`;
        this.declared = routinesDeclared;
        this.local = routinesLocal;
        this.distant = routinesDistant;

        this.cache = {};
        this.cacheEnable = Boolean(config[cacheParameter] || false);
    }

    async get(routineCalled) {
        if (this.cache[routineCalled]) {
            return this.cache[routineCalled];
        }
        const routineLocal = this.local.find(r => r[2] === routineCalled);
        const routineDistant = this.distant.find(r => r[2] === routineCalled);
        // Warning : don't change the order, distant routine should be only use if there no local routine
        if (routineLocal) {
            this.cache[routineCalled] = routineLocal;
            return routineLocal;
        }
        if (routineDistant) {
            const response = await fetch(routineDistant[0]);
            const routineScript = await response.text();
            if (routineScript) {
                routineDistant[1] = ezs.metaString(routineScript);
                routineDistant[3] = routineScript;
            }
        }
        this.cache[routineCalled] = routineDistant;
        return routineDistant;
    }

    async list() {
        const availableListPromises = this.declared.map(name => this.get(name));
        const availableList = await Promise.all(availableListPromises);
        return availableList
            .map(([, metaData, id]) => ({
                id,
                name: metaData.label,
                type: metaData.type,
            }))
            .filter(script => script.name !== undefined);
    }

    useCache() {
        return this.cacheEnable;
    }
}
