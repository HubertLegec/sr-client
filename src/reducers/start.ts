import * as _ from 'lodash';
import {handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';

export enum ServerStatus {
    CREATED = 'CREATED',
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED'
}

export interface ServerDef {
    id?: number;
    address: string;
    port: string;
    status: ServerStatus;
}

export interface StartStoreState {
    username: string;
    servers: ServerDef[];
}

const initialState = {
    username: undefined,
    servers: []
};

export default handleActions<StartStoreState, any>({
    [Actions.ADD_SERVER]: (state, action) => {
        const maxId = _.chain(state.servers)
            .map(s => s.id)
            .max()
            .value();
        return _.assign({}, state, {
            servers: [...state.servers, _.assign(action.payload, {id: _.defaultTo(maxId, -1) + 1})]
        })
    },

    [Actions.DELETE_SERVER]: (state, action) => {
        return _.assign({}, state, {
            servers: _.filter(state.servers, s => s.id !== action.payload.id)
        })
    },

    [Actions.SET_USERNAME]: (state, action) => {
        return _.assign({}, state, {username: action.payload})
    }
}, initialState);