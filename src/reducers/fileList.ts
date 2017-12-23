import {handleActions} from 'redux-actions';

export interface FileListStoreState {
    [server: string]: File[];
}

const initialState = {};

export default handleActions<FileListStoreState>({

}, initialState);