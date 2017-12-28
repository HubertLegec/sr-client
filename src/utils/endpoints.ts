import * as _ from "lodash";
import {ServerDef} from "../reducers/start";
import * as FileListActions from "../actions/fileList";
import * as FileActions from "../actions/file";
import {deleteJson, getJson, postJson} from "./fetchJson";
import {File, Record} from "../types/dtos";

export function fetchFilesForServers(servers: ServerDef[], userId: string, actions: typeof FileListActions) {
    const {filesForServerFetched} = actions;
    servers.forEach(s => {
        console.log(`Fetching files for server #${s.id}`);
        getJson(`http://${s.address}:${s.port}/files`, userId)
            .then(json => {
                const files = _.map(json, f => ({name: f, serverId: s.id} as File));
                filesForServerFetched({server: s.id, files})
            });
    });
}

export function createFileForServer(server: ServerDef, userId: string, file: File, actions: typeof FileListActions) {
    const {newFileForServer} = actions;
    console.log(`Creating file ${file.name} for server#${server.id}`);
    postJson(`http://${server.address}:${server.port}/files`, userId, {
        filename: file.name
    }).then(json =>
        newFileForServer({server: server.id, file})
    );
}

export function deleteFileForServer(server: ServerDef, userId: string, file: File, actions: typeof FileListActions) {
    const {deleteFileForServer} = actions;
    console.log(`Delete file ${file.name} for server#${server.id}`);
    deleteJson(`http://${server.address}:${server.port}/files/${file.name}`, userId)
        .then(json =>
        deleteFileForServer({server: server.id, file})
    );
}

export function fetchRecordsForFile(server: ServerDef, userId: string, filename: string, actions: typeof FileActions) {
    const {recordsForFileFetched} = actions;
    console.log(`Fetching records for file ${filename}`);
    getJson(`http://${server.address}:${server.port}/files/${filename}/records`, userId)
        .then(json =>
            recordsForFileFetched(json)
        );
}

export function createRecordForFile(server: ServerDef, userId: string, filename: string, record: Record, actions: typeof FileActions) {
    const {newRecordForFile} = actions;
    console.log(`Creating new record for file ${filename} and server #${server.id}`);
    postJson(`http://${server.address}:${server.port}/files/${filename}/records`, userId, {
        content: record.content
    }).then(json => {
            console.log(`Record #${json.recordId} created successfully`);
            record.id = json.recordId;
            newRecordForFile(record);
        });
}

export function removeRecordForFile(server: ServerDef, userId: string, record: Record, actions: typeof FileActions) {
    const {recordForFileRemoved} = actions;
    console.log(`Removing record #${record.id} for file ${record.filename} and server #${server.id}`);
    deleteJson(`http://${server.address}:${server.port}/files/${record.filename}/records/${record.id}`, userId)
        .then(json => {
            console.log(`Record #${record.id} removed successfully`);
            recordForFileRemoved(record.id);
        });
}