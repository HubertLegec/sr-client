import {handleActions} from 'redux-actions';
import {Record} from "../types/dtos";

export interface FileStoreState {
    records: Record[];
}

const initialState = {
    records: []
};

export default handleActions<FileStoreState>({

}, initialState);