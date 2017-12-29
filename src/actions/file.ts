import {createAction} from "redux-actions";
import * as Actions from '../constants/actions';
import {Record} from "../types/dtos";
import {RecordStatus} from "../types/enumerates";

export const recordsForFileFetched = createAction<Record[]>(Actions.FILE_RECORDS_FETCHED);
export const fileRecordCreated = createAction<Record>(Actions.FILE_RECORD_CREATED);
export const fileRecordRemoved = createAction<number>(Actions.FILE_RECORD_REMOVED);
export const fileRecordEdited = createAction<Record>(Actions.FILE_RECORD_EDITED);
export const fileRecordStatusChanged = createAction<{recordId: number, newStatus: RecordStatus}>(Actions.FILE_RECORD_STATUS_CHANGED);