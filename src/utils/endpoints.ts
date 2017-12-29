import * as _ from "lodash";
import {ServerDef} from "../reducers/start";
import * as FileListActions from "../actions/fileList";
import * as FileActions from "../actions/file";
import {deleteJson, getJson, postJson, putJson} from "./fetchJson";
import {File, Record} from "../types/dtos";

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
    }).then(json =>
        newFileForServer({server: server.id, file})
    );
}

export function deleteFileForServer(server: ServerDef, userId: string, file: File, actions: typeof FileListActions) {
    const {deleteFileForServer} = actions;
    console.log(`Delete file ${file.name} for server#${server.id}`);
    const url = `http://${server.address}:${server.port}/files/${file.name}`;
    deleteJson(url, userId)
        .then(json =>
        deleteFileForServer({server: server.id, file})
    );
}

export function fetchRecordsForFile(server: ServerDef, userId: string, filename: string, actions: typeof FileActions) {
    const {recordsForFileFetched} = actions;
    console.log(`Fetching records for file ${filename}`);
    const url = `http://${server.address}:${server.port}/files/${filename}/records`;
    getJson(url, userId)
        .then(json =>
            recordsForFileFetched(json)
        );
}

export function createRecordForFile(server: ServerDef, userId: string, filename: string, record: Record, actions: typeof FileActions) {
    const {fileRecordCreated} = actions;
    console.log(`Creating new record for file ${filename} and server #${server.id}`);
    const url = `http://${server.address}:${server.port}/files/${filename}/records`;
    postJson(url, userId, {
        content: record.content
    }).then(json => {
            console.log(`Record #${json.recordId} created successfully`);
            record.id = json.recordId;
            fileRecordCreated(record);
        });
}

export function removeRecordForFile(server: ServerDef, userId: string, record: Record, actions: typeof FileActions) {
    const {fileRecordRemoved} = actions;
    console.log(`Removing record #${record.id} for file ${record.filename} and server #${server.id}`);
    const url = `http://${server.address}:${server.port}/files/${record.filename}/records/${record.id}`;
    deleteJson(url, userId)
        .then(json => {
            console.log(`Record #${record.id} removed successfully`);
            fileRecordRemoved(record.id);
        });
}

export function editRecordForFile(server: ServerDef, userId: string, record: Record, actions: typeof FileActions) {
    const {fileRecordEdited} = actions;
    console.log(`Editing record #${record.id} for file ${record.filename} and server #${server.id}`);
    const url = `http://${server.address}:${server.port}/files/${record.filename}/records/${record.id}`;
    putJson(url, userId, {
        content: record.content
    }).then( json => {
           console.log(`Record #${record.id} edited successfully`);
           fileRecordEdited(record);
           unlockRecordForFile(server, userId, record);
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