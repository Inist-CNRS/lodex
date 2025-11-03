import dataset from './dataset';
import exportReducer from './export';
import format from './formats/reducer';
import resource from './resource';
import searchReducer from './search/reducer';
import breadcrumb from './breadcrumb/reducer';
import menu from './menu/reducer';
import displayConfig from './displayConfig/reducer';
import sharedReducers, {
    type SharedState,
} from '@lodex/frontend-common/sharedReducers';

export type State = SharedState & {
    dataset: ReturnType<typeof dataset>;
    export: ReturnType<typeof exportReducer>;
    resource: ReturnType<typeof resource>;
    format: ReturnType<typeof format>;
    search: ReturnType<typeof searchReducer>;
    menu: ReturnType<typeof menu>;
    breadcrumb: ReturnType<typeof breadcrumb>;
    displayConfig: ReturnType<typeof displayConfig>;
};

const reducers = {
    ...sharedReducers,
    dataset,
    export: exportReducer,
    resource,
    format,
    search: searchReducer,
    menu,
    breadcrumb,
    displayConfig,
};

export default reducers;
