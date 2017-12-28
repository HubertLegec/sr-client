import * as _ from "lodash";
import * as React from "react";
import {Panel} from "react-bootstrap";
import {File} from "../types/dtos";
import * as ListGroup from "react-bootstrap/lib/ListGroup";
import {FileRow} from "./FileRow";
import {ServerDef} from "../reducers/start";

interface ServerFilesProps {
    server: ServerDef;
    eventKey: number;
    files: File[];
    onClick: (file: File) => void;
    onRemoveClick: (file: File) => void;
    onCreateClick: (file: File) => void;
}

interface ServerFilesState {}

export class ServerFiles extends React.Component<ServerFilesProps, ServerFilesState> {
    render() {
        const {files, onClick, onRemoveClick, eventKey} = this.props;
        return <Panel eventKey={eventKey}
                      header={this.getPanelHeader()}>
            <ListGroup fill>
                {_.map(files, (file, idx) =>
                    <FileRow key={idx}
                             file={file}
                             onClick={onClick}
                             onRemove={onRemoveClick}/>
                )}
                <FileRow isNewElement={true}
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