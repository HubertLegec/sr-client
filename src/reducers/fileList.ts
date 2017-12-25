import * as _ from "lodash";
import {handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';
import {File} from "../types/dtos";

export interface FileListStoreState {
    [server: number]: File[];
}

const initialState = {};

export default handleActions<FileListStoreState, any>({
    [Actions.FILES_FOR_SERVER_FETCHED]: (state, action) => {
        const files = action.payload.files;
        const server = action.payload.server;
        return _.assign({}, state, {
            [server]: files
        })
},

    [Actions.NEW_FILE_FOR_SERVER]: (state, action) => {
        const file = action.payload.file;
        const server = action.payload.server;
        return _.assign({}, state, {
            [server]: [...state[server], file]
        });
    },

    [Actions.DELETE_FILE_FOR_SERVER]: (state, action) => {
        const file = action.payload.file;
        const server = action.payload.server;
        return _.assign({}, state, {
            [server]: _.filter(state[server], f => f.serverId !== file.serverId)
        });
    }
}, initialState);