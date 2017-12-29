import * as FileActions from "../actions/file";
import {RecordStatus} from "../types/enumerates";

export function onRecordStateChange(event: any, actions: typeof FileActions) {
    const {fileRecordCreated, fileRecordRemoved, fileRecordEdited, fileRecordStatusChanged} = actions;
    const eventType = event.eventType;
    switch (eventType) {
        case 'RECORD_CREATED':
            const newRecord = event.record;
            fileRecordCreated(newRecord);
            return;
        case 'RECORD_REMOVED':
            const recId = event.recordId;
            fileRecordRemoved(recId);
            return;
        case 'RECORD_UPDATED':
            const updatedRecord = event.record;
            fileRecordEdited(updatedRecord);
            return;
        case 'LOCK_ASSIGNED':
            const lockedRecordId = event.recordId;
            fileRecordStatusChanged({recordId: lockedRecordId, newStatus: RecordStatus.EDITING});
            return;
        case 'LOCK_PICKED_UP':
            const unlockedRecordId = event.recordId;
            fileRecordStatusChanged({recordId: unlockedRecordId, newStatus: RecordStatus.AVAILABLE});
            return;
    }
}