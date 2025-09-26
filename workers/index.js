import ezs from '@ezs/core';
import Basics from '@ezs/basics';
import Analytics from '@ezs/analytics';
import Lodex from '@ezs/lodex';
import Conditor from '@ezs/conditor';
import Istex from '@ezs/istex';
import Storage from '@ezs/storage';
import localConfig from '../config.json';

ezs.settings.feed.timeout = Number(localConfig.timeout) || 120000;
ezs.use(Basics);
ezs.use(Analytics);
ezs.use(Lodex);
ezs.use(Conditor);
ezs.use(Istex);
ezs.use(Storage);

ezs.createCluster(31976, __dirname);
