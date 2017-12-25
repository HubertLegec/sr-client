import {createAction} from "redux-actions";
import * as Actions from '../constants/actions';
import {ServerDef, ServerStatus} from "../reducers/start";
import {WebsocketConnection} from "../utils/WebsocketConnection";

export const addServer = createAction<ServerDef>(Actions.ADD_SERVER);
export const removeServer = createAction<ServerDef>(Actions.DELETE_SERVER);
export const updateServerState = createAction<{id: number, status: ServerStatus}>(Actions.UPDATE_SERVER_STATUS);

export const setUsername = createAction<string>(Actions.SET_USERNAME);

export const addWebsocketConnection = createAction<WebsocketConnection>(Actions.ADD_WEBSOCKET_CONNECTION);
export const removeWebsocketConnection = createAction<WebsocketConnection>(Actions.DELETE_WEBSOCKET_CONNECTION);