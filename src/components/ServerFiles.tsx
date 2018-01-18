import * as _ from "lodash";
import * as React from "react";
import {Panel} from "react-bootstrap";
import {File, Record} from "../types/dtos";
import * as ListGroup from "react-bootstrap/lib/ListGroup";
import {FileRow} from "./FileRow";
import {ServerDef} from "../reducers/start";
import * as FileListActions from "../actions/fileList";

interface ServerFilesProps {
    server: ServerDef;
    username: string;
    eventKey: number;
    files: File[];
    records: Record[];
    onClick: (file: File) => void;
    onRemoveClick: (file: File) => void;
    onCreateClick: (file: File) => void;
    actions: typeof FileListActions;
}

interface ServerFilesState {}

export class ServerFiles extends React.Component<ServerFilesProps, ServerFilesState> {
    render() {
        const {files, server, onClick, onRemoveClick, eventKey, username, actions, records} = this.props;
        return <Panel eventKey={eventKey}
                      header={this.getPanelHeader()}>
            <ListGroup fill>
                {_.map(files, (file, idx) =>
                    <FileRow key={idx}
                             file={file}
                             records={_.filter(records, r => r.filename === file.name)}
                             server={server}
                             username={username}
                             onClick={onClick}
                             onRemove={onRemoveClick}
                             actions={actions}/>
                )}
                <FileRow isNewElement={true}
                         username={username}
                         onCreate={f => this.onCreateFile(f)}/>
            </ListGroup>
        </Panel>
    }

    private getPanelHeader() {
        const {server} = this.props;
        return <h3>{`Server ${server.id} `}<small>{`${server.address}:${server.port}`}</small></h3>;
    }

    private onCreateFile(file: File) {
        const {onCreateClick, server} = this.props;
        file.serverId = server.id;
        onCreateClick(file);
    }
}