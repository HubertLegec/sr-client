import * as FileListActions from "../actions/fileList";
import {RecordStatus} from "../types/enumerates";
import {ServerDef} from "../reducers/start";
import {Record} from "../types/dtos";

export function onRecordStateChange(event: any, server: ServerDef, actions: typeof FileListActions) {
    const {fileRecordCreated, fileRecordRemoved, fileRecordEdited, fileRecordStatusChanged} = actions;
    const eventType = event.eventType;
    switch (eventType) {
        case 'RECORD_CREATED':
            const newRecord = event.record;
            newRecord.serverId = server.id;
            fileRecordCreated(newRecord);
            return;
        case 'RECORD_REMOVED':
            const removedRecord = eventToRecord(event, server);
            fileRecordRemoved(removedRecord);
            return;
        case 'RECORD_UPDATED':
            const updatedRecord = event.record;
            updatedRecord.serverId = server.id;
            fileRecordEdited(updatedRecord);
            return;
        case 'LOCK_ASSIGNED':
            const lockedRecord = eventToRecord(event, server);
            fileRecordStatusChanged({record: lockedRecord, newStatus: RecordStatus.EDITING});
            return;
        case 'LOCK_PICKED_UP':
            const unlockedRecord = eventToRecord(event, server);
            fileRecordStatusChanged({record: unlockedRecord, newStatus: RecordStatus.AVAILABLE});
            return;
        case 'LOCK_REJECTED':
            const requestedRecord = eventToRecord(event, server);
            fileRecordStatusChanged({record: requestedRecord, newStatus: RecordStatus.AVAILABLE});
            return;
    }
}

function eventToRecord(event: any, server: ServerDef): Record {
    const recId = event.recordId;
    const filename = event.filename;
    return {
        serverId: server.id,
        filename,
        id: recId,
        content: undefined,
        status: undefined
    };
}