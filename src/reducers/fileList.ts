import {handleActions} from 'redux-actions';
import {File} from "../types/dtos";

export interface FileListStoreState {
    [server: string]: File[];
}

const initialState = {};

export default handleActions<FileListStoreState>({

}, initialState);