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
    [Actions.FILE_RECORDS_FETCHED]: (state, action) => {
        const records = action.payload;
        return _.assign({}, state, {
            records
        });
    },

    [Actions.FILE_RECORD_CREATED]: (state, action) => {
        return _.assign({}, state, {
            records: [...state.records, action.payload]
        })
    },

    [Actions.FILE_RECORD_REMOVED]: (state, action) => {
        return _.assign({}, state, {
            records: _.filter(state.records, r => r.id !== action.payload)
        })
    },

    [Actions.FILE_RECORD_EDITED]: (state, action) => {
        const record = action.payload;
        return _.assign({}, state, {
            records: _.map(state.records, r =>
                r.id === record.id ? _.assign({}, r, {content: record.content}) : r
            )
        });
    },

    [Actions.FILE_RECORD_STATUS_CHANGED]: (state, action) => {
        const recordId = action.payload.recordId;
        const newStatus = action.payload.newStatus;
        return _.assign({}, state, {
            records: _.map(state.records, r =>
                r.id === recordId ? _.assign({}, r, {status: newStatus}) : r
            )
        })
    }
}, initialState);