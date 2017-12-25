import * as _ from "lodash";
import {ServerDef} from "../reducers/start";
import * as FileListActions from "../actions/fileList";
import {getJson, postJson} from "./fetchJson";
import {File} from "../types/dtos";

export function fetchFilesForServers(servers: ServerDef[], actions: typeof FileListActions) {
    const {filesForServerFetched} = actions;
    servers.forEach(s => {
        console.log(`Fetching files for server #${s.id}`);
        getJson(`http://${s.address}:${s.port}/files`)
            .then(json => {
                const files = _.map(json, f => ({name: f, serverId: s.id} as File));
                filesForServerFetched({server: s.id, files})
            });
    })
}

export function createFileForServer(server: ServerDef, file: File, actions: typeof FileListActions) {
    const {newFileForServer} = actions;
    console.log(`Creating file ${file.name} for server#${server.id}`);
    postJson(`http://${server.address}:${server.port}/files`, {
        filename: file.name
    }).then(json =>
        newFileForServer({server: server.id, file})
    );
}