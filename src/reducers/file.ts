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
        if (!_.isEmpty(records)) {
            const filename = records[0].filename;
            const serverId = records[0].serverId;
            const oldRecords = _.filter(state.records, r => r.filename !== filename || r.serverId !== serverId);
            return _.assign({}, state, {
                records: [...oldRecords, ...records]
            });
        }
        return _.assign({}, state, {
            records: [...state.records, ...records]
        });
    },

    [Actions.REMOVE_FILE_RECORDS]: (state, action) => {
        const serverId = action.payload.server;
        const filename = action.payload.file.name;
        return _.assign({}, state, {
            records: _.filter(state.records, r => r.serverId !== serverId || r.filename !== filename)
        })
    },

    [Actions.FILE_RECORD_CREATED]: (state, action) => {
        return _.assign({}, state, {
            records: [...state.records, action.payload]
        })
    },

    [Actions.FILE_RECORD_REMOVED]: (state, action) => {
        const record = action.payload;
        return _.assign({}, state, {
            records: _.filter(state.records, r => r.id !== record.id || r.filename !== record.filename || r.serverId !== record.serverId)
        })
    },

    [Actions.FILE_RECORD_EDITED]: (state, action) => {
        const record = action.payload;
        return _.assign({}, state, {
            records: _.map(state.records, r =>
                r.id === record.id && r.filename === record.filename && r.serverId === record.serverId ?
                    _.assign({}, r, {content: record.content}) : r
            )
        });
    },

    [Actions.FILE_RECORD_STATUS_CHANGED]: (state, action) => {
        const record = action.payload.record;
        const newStatus = action.payload.newStatus;
        return _.assign({}, state, {
            records: _.map(state.records, r =>
                r.id === record.id && r.filename === record.filename && r.serverId === record.serverId ?
                    _.assign({}, r, {status: newStatus}) : r
            )
        })
    }
}, initialState);