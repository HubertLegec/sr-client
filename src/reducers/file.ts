import * as _ from "lodash";
import {handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';
import {Record} from "../types/dtos";

export interface FileStoreState {
    records: Record[];
}

const initialState = {
    records: []
};

export default handleActions<FileStoreState, any>({
    [Actions.RECORDS_FOR_FILE_FETCHED]: (state, action) => {
        const records = action.payload;
        return _.assign({}, state, {
            records
        });
    },

    [Actions.NEW_RECORD_FOR_FILE]: (state, action) => {
        return _.assign({}, state, {
            records: [...state.records, action.payload]
        })
    },

    [Actions.RECORD_FOR_FILE_REMOVED]: (state, action) => {
        return _.assign({}, state, {
            records: _.filter(state.records, r => r.id !== action.payload)
        })
    }
}, initialState);