import * as _ from 'lodash';
import {handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';
import {WebsocketConnection} from "../utils/WebsocketConnection";

export enum ServerStatus {
    CREATED = 'CREATED',
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED'
}

export interface ServerDef {
    id?: number;
    address: string;
    port: string;
    status: ServerStatus;
    connection: WebsocketConnection;
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

    [Actions.UPDATE_SERVER_STATUS]: (state, action) => {
        const id = action.payload.id;
        const newStatus = action.payload.status;
        return _.assign({}, state, {
            servers: _.chain(state.servers).map(s => {
                return s.id === id ? _.assign({}, s, {status: newStatus}) : s;
            }).value()
        })
    },

    [Actions.SET_USERNAME]: (state, action) => {
        return _.assign({}, state, {username: action.payload})
    },

    [Actions.ADD_WEBSOCKET_CONNECTION]: (state, action) => {
        const connection: WebsocketConnection = action.payload;
        const id = connection.id;
        return _.assign({}, state, {
            servers: _.chain(state.servers).map(s => {
                return s.id === id ? _.assign({}, s, {connection}) : s;
            }).value()
        })
    },

    [Actions.DELETE_WEBSOCKET_CONNECTION]: (state, action) => {
        const id = action.payload;
        return _.assign({}, state, {
            servers: _.chain(state.servers).map(s => {
                return s.id === id ? _.assign({}, s, {connection: undefined}) : s;
            }).value()
        })
    }
}, initialState);