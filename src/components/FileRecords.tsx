import * as _ from "lodash";
import * as React from "react";
import {Record} from "../types/dtos";
import {ServerDef} from "../reducers/start";
import {Grid, ListGroup, Panel} from "react-bootstrap";
import {RecordRow} from "./RecordRow";
import {
    createRecordForFile, editRecordForFile, lockRecordForFile, removeRecordForFile,
    unlockRecordForFile
} from "../utils/endpoints";
import {RecordStatus} from "../types/enumerates";
import * as FileListActions from "../actions/fileList";


interface FileRecordsProps {
    filename: string;
    username: string;
    records: Record[];
    server: ServerDef;
    onClick: () => void;
    actions: typeof FileListActions;
}

interface FileRecordsState {}

export class FileRecords extends React.Component<FileRecordsProps, FileRecordsState> {
    render() {
        const {records} = this.props;
        return <Panel header={this.getHeader()}>
                <ListGroup fill>
                    {_.map(records, r =>
                        <RecordRow key={r.id}
                                   record={r}
                                   onSubmitEdit={r => this.onSubmitEditRecord(r)}
                                   onRemove={r => this.onRemoveRecord(r)}
                                   onStatusChange={(r, s) => this.onRecordStatusChange(r, s)}/>
                    )}
                    <RecordRow isNewItem={true}
                               onCreate={r => this.onCreateNewRecord(r)}/>
                </ListGroup>
            </Panel>;
    }

    private getHeader() {
        const {filename, server, onClick} = this.props;
        const serverName = `${server.address}:${server.port}`;
        return <h3 onClick={onClick}>{filename}<small>{` on ${serverName}`}</small></h3>
    }

    private onCreateNewRecord(record: Record) {
        const {actions, username, filename, server} = this.props;
        record.filename = filename;
        record.serverId = server.id;
        createRecordForFile(server, username, filename, record, actions);
    }

    private onRemoveRecord(record: Record) {
        const {actions, username, server} = this.props;
        removeRecordForFile(server, username, record, actions);
    }

    private onSubmitEditRecord(record: Record) {
        const {actions, username, server} = this.props;
        editRecordForFile(server, username, record, actions);
    }

    private onRecordStatusChange(record: Record, newStatus: RecordStatus) {
        const {username, actions, server} = this.props;
        const {fileRecordStatusChanged} = actions;
        switch (newStatus) {
            case RecordStatus.EDITING:
                fileRecordStatusChanged({record: record, newStatus: RecordStatus.WAITING});
                lockRecordForFile(server, username, record);
                return;
            case RecordStatus.AVAILABLE:
                unlockRecordForFile(server, username, record);
                return;
            default:
                throw new Error(`Unsupported record status: ` + newStatus);
        }
    }
}