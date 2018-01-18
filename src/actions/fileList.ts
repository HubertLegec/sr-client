import {createAction} from "redux-actions";
import * as Actions from '../constants/actions';
import {File, Record} from "../types/dtos";
import {RecordStatus} from "../types/enumerates";

export const filesForServerFetched = createAction<{server: number, files: File[]}>(Actions.FILES_FOR_SERVER_FETCHED);
export const newFileForServer = createAction<{server: number, file: File}>(Actions.NEW_FILE_FOR_SERVER);
export const deleteFileForServer = createAction<{server: number, file: File}>(Actions.DELETE_FILE_FOR_SERVER);
export const fileClicked = createAction<{server: string, filename: string}>(Actions.FILE_CLICKED);
export const recordsForFileFetched = createAction<Record[]>(Actions.FILE_RECORDS_FETCHED);
export const removeFileRecords = createAction<{server: number, file: File}>(Actions.REMOVE_FILE_RECORDS);
export const fileRecordCreated = createAction<Record>(Actions.FILE_RECORD_CREATED);
export const fileRecordRemoved = createAction<Record>(Actions.FILE_RECORD_REMOVED);
export const fileRecordEdited = createAction<Record>(Actions.FILE_RECORD_EDITED);
export const fileRecordStatusChanged = createAction<{record: Record, newStatus: RecordStatus}>(Actions.FILE_RECORD_STATUS_CHANGED);