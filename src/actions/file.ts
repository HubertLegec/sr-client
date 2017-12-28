import {createAction} from "redux-actions";
import * as Actions from '../constants/actions';
import {Record} from "../types/dtos";

export const recordsForFileFetched = createAction<Record[]>(Actions.RECORDS_FOR_FILE_FETCHED);
export const newRecordForFile = createAction<Record>(Actions.NEW_RECORD_FOR_FILE);
export const recordForFileRemoved = createAction<number>(Actions.RECORD_FOR_FILE_REMOVED);