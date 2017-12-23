import {createAction} from "redux-actions";
import * as Actions from '../constants/actions';

export const addServer = createAction<any>(Actions.ADD_SERVER);
export const removeServer = createAction<any>(Actions.DELETE_SERVER);

export const setUsername = createAction<any>(Actions.SET_USERNAME);