import Path from 'path';
import fs from 'fs';
import ezs from 'ezs';
import URL from 'url';
import fetch from 'fetch-with-proxy';
import config from '../../../config.json';

export default class Script {
    constructor(source) {
        const routineDirectory = `./${source}/`;
        const routineLocalDirectory = Path.resolve(
            __dirname,
            '../',
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
        const routinesDistant = config.routines
            .map(routineName =>
                URL.resolve(routineRepository, routineName.concat('.ini')),
            )
            .map(fileName => [
                fileName,
                null,
                Path.basename(fileName, '.ini'),
                null,
            ]);
        this.local = routinesLocal;
        this.distant = routinesDistant;
    }

    async get(routineCalled) {
        const routineLocal = this.local.find(r => r[2] === routineCalled);
        const routineDistant = this.distant.find(r => r[2] === routineCalled);
        // Warning : don't change the order, distant routine should be only use if there no local routine
        if (routineLocal) {
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
        return routineDistant;
    }
}
