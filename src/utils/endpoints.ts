import * as _ from "lodash";
import {ServerDef} from "../reducers/start";
import * as FileListActions from "../actions/fileList";
import {deleteJson, getJson, postJson, putJson} from "./fetchJson";
import {File, Record} from "../types/dtos";
import {notificationDispatcher} from "../index";
import {NotificationLevel} from "./NotificationsDispatcher";

export function fetchFilesForServers(servers: ServerDef[], userId: string, actions: typeof FileListActions) {
    const {filesForServerFetched} = actions;
    servers.forEach(s => {
        console.log(`Fetching files for server #${s.id}`);
        const url = `http://${s.address}:${s.port}/files`;
        getJson(url, userId)
            .then(json => {
                const files = _.map(json, f => ({name: f, serverId: s.id} as File));
                filesForServerFetched({server: s.id, files})
            });
    });
}

export function createFileForServer(server: ServerDef, userId: string, file: File, actions: typeof FileListActions) {
    const {newFileForServer} = actions;
    console.log(`Creating file ${file.name} for server#${server.id}`);
    const url = `http://${server.address}:${server.port}/files`;
    postJson(url, userId, {
        filename: file.name
    }).then(resp => {
        if (resp.status === 200) {
            newFileForServer({server: server.id, file});
        } else {
            notificationDispatcher.publishNotification("Create file failed", resp.json.message, NotificationLevel.ERROR);
        }
    });
}

export function deleteFileForServer(server: ServerDef, userId: string, file: File, actions: typeof FileListActions) {
    const {deleteFileForServer} = actions;
    console.log(`Delete file ${file.name} for server#${server.id}`);
    const url = `http://${server.address}:${server.port}/files/${file.name}`;
    deleteJson(url, userId)
        .then(resp => {
            if (resp.status === 200) {
                deleteFileForServer({server: server.id, file})
            } else {
                notificationDispatcher.publishNotification("Delete failed", resp.json.message, NotificationLevel.ERROR)
            }
        });
}

export function fetchRecordsForFile(server: ServerDef, userId: string, filename: string, actions: typeof FileListActions) {
    const {recordsForFileFetched} = actions;
    console.log(`Fetching records for file ${filename}`);
    const url = `http://${server.address}:${server.port}/files/${filename}/records`;
    getJson(url, userId)
        .then(json => {
            const records = _.map(json, (r: Record)=> {
                r.serverId = server.id;
                return r;
            });
            recordsForFileFetched(records);
        });
}

export function createRecordForFile(server: ServerDef, userId: string, filename: string, record: Record, actions: typeof FileListActions) {
    const {fileRecordCreated} = actions;
    console.log(`Creating new record for file ${filename} and server #${server.id}`);
    const url = `http://${server.address}:${server.port}/files/${filename}/records`;
    postJson(url, userId, {
        content: record.content
    }).then(resp => {
        if (resp.status === 200) {
            console.log(`Record #${resp.json.recordId} created successfully`);
            record.id = resp.json.recordId;
            fileRecordCreated(record);
        } else {
            notificationDispatcher.publishNotification("Create record failed", resp.json.message, NotificationLevel.ERROR);
        }
    });
}

export function removeRecordForFile(server: ServerDef, userId: string, record: Record, actions: typeof FileListActions) {
    const {fileRecordRemoved} = actions;
    console.log(`Removing record #${record.id} for file ${record.filename} and server #${server.id}`);
    const url = `http://${server.address}:${server.port}/files/${record.filename}/records/${record.id}`;
    deleteJson(url, userId)
        .then(resp => {
            if (resp.status === 200) {
                console.log(`Record #${record.id} removed successfully`);
                fileRecordRemoved(record);
            } else {
                notificationDispatcher.publishNotification("Delete failed", resp.json.message, NotificationLevel.ERROR);
            }
        });
}

export function editRecordForFile(server: ServerDef, userId: string, record: Record, actions: typeof FileListActions) {
    const {fileRecordEdited} = actions;
    console.log(`Editing record #${record.id} for file ${record.filename} and server #${server.id}`);
    const url = `http://${server.address}:${server.port}/files/${record.filename}/records/${record.id}`;
    putJson(url, userId, {
        content: record.content
    }).then(resp => {
        if (resp.status === 200) {
            console.log(`Record #${record.id} edited successfully`);
            fileRecordEdited(record);
            unlockRecordForFile(server, userId, record);
        } else {
            notificationDispatcher.publishNotification("Update failed", resp.json.message, NotificationLevel.ERROR);
        }
    });
}

export function lockRecordForFile(server: ServerDef, userId: string, record: Record) {
    console.log(`Locking record #${record.id} in file ${record.filename} on server #${server.id}`);
    server.connection.emit('record_state_change', {
        eventType: 'LOCK_RECORD',
        file: record.filename,
        record: record.id,
        userId: userId
    })
}

export function unlockRecordForFile(server: ServerDef, userId: string, record: Record) {
    console.log(`Unlocking record #${record.id} in file ${record.filename} on server #${server.id}`);
    server.connection.emit('record_state_change', {
        eventType: 'UNLOCK_RECORD',
        file: record.filename,
        record: record.id,
        userId: userId
    })
}