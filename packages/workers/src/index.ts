// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
// @ts-expect-error TS(2792): Cannot find module '@ezs/basics'. Did you mean to ... Remove this comment to see the full error message
import Basics from '@ezs/basics';
// @ts-expect-error TS(2792): Cannot find module '@ezs/analytics'. Did you mean ... Remove this comment to see the full error message
import Analytics from '@ezs/analytics';
import Lodex from '@ezs/lodex';
// @ts-expect-error TS(2792): Cannot find module '@ezs/conditor'. Did you mean t... Remove this comment to see the full error message
import Conditor from '@ezs/conditor';
// @ts-expect-error TS(2792): Cannot find module '@ezs/istex'. Did you mean to s... Remove this comment to see the full error message
import Istex from '@ezs/istex';
// @ts-expect-error TS(2792): Cannot find module '@ezs/storage'. Did you mean to... Remove this comment to see the full error message
import Storage from '@ezs/storage';
import localConfig from '../../../config.json';

ezs.settings.feed.timeout = Number(localConfig.timeout) || 120000;
ezs.use(Basics);
ezs.use(Analytics);
ezs.use(Lodex);
ezs.use(Conditor);
ezs.use(Istex);
ezs.use(Storage);

ezs.createCluster(31976, __dirname);
