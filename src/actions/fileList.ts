import {createAction} from "redux-actions";
import * as Actions from '../constants/actions';
import {File} from "../types/dtos";

export const filesForServerFetched = createAction<{server: number, files: File[]}>(Actions.FILES_FOR_SERVER_FETCHED);
export const newFileForServer = createAction<{server: number, file: File}>(Actions.NEW_FILE_FOR_SERVER);
export const deleteFileForServer = createAction<{server: number, file: File}>(Actions.DELETE_FILE_FOR_SERVER);