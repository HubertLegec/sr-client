import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'
import fileList, {FileListStoreState} from './fileList';
import file, {FileStoreState} from './file';
import start, {StartStoreState} from './start';

export interface RootState {
    fileList: FileListStoreState;
    file: FileStoreState;
    start: StartStoreState;
}

export default combineReducers<RootState>({
    fileList,
    file,
    start,
    router: routerReducer
});