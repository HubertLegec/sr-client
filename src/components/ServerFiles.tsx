import * as _ from "lodash";
import * as React from "react";
import {Panel} from "react-bootstrap";
import {File} from "../types/dtos";
import * as ListGroup from "react-bootstrap/lib/ListGroup";
import {FileRow} from "./FileRow";

interface ServerFilesProps {
    server: string;
    eventKey: number;
    files: File[];
    onClick: (file: File) => void;
    onRemoveClick: (file: File) => void;
}

interface ServerFilesState {}

export class ServerFiles extends React.Component<ServerFilesProps, ServerFilesState> {
    render() {
        const {server, files, onClick, onRemoveClick, eventKey} = this.props;
        return <Panel collapsible eventKey={eventKey} header={<h3>{server}</h3>}>
            <ListGroup fill>
                {_.map(files, (file, idx) =>
                    <FileRow key={idx}
                             file={file}
                             onClick={onClick}
                             onRemove={onRemoveClick}/>
                )}
            </ListGroup>
        </Panel>
    }
}