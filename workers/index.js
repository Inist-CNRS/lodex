import debug from 'debug';
import ezs from '@ezs/core';
import Basics from '@ezs/basics';
import Analytics from '@ezs/analytics';
import Storage from '@ezs/storage';
import Lodex from '@ezs/lodex';
import Conditor from '@ezs/conditor';
import Istex from '@ezs/istex';
import Loterre from '@ezs/loterre';

debug.enable('ezs');
ezs.use(Basics);
ezs.use(Analytics);
ezs.use(Storage);
ezs.use(Lodex);
ezs.use(Conditor);
ezs.use(Istex);
ezs.use(Loterre);

ezs.createCluster(31976, __dirname);
