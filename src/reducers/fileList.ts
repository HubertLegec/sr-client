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
            [server]: _.filter(state[server], f => f.name !== file.name)
        });
    },

    [Actions.FILE_CLICKED]: (state, action) => {
        const filename = action.payload.filename;
        const server = action.payload.server;
        const files = _.cloneDeep(state[server]);
        const file = _.find(files, f => f.name === filename);
        file.isOpened = !file.isOpened;
        return _.assign({}, state, {
            [server]: files
        })
    }
}, initialState);