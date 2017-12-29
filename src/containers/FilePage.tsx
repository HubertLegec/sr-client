import * as _ from "lodash";
import * as React from "react";
import {RootState} from "../reducers";
import {connect} from "react-redux";
import {Record} from "../types/dtos";
import {RecordRow} from "../components/RecordRow";
import {Grid, ListGroup, Panel} from "react-bootstrap";
import * as FileActions from "../actions/file";
import {bindActionCreators} from "redux";
import {ServerDef} from "../reducers/start";
import {
    createRecordForFile, editRecordForFile, fetchRecordsForFile, lockRecordForFile,
    removeRecordForFile, unlockRecordForFile
} from "../utils/endpoints";
import {RecordStatus} from "../types/enumerates";
import {onRecordStateChange} from "../utils/eventListeners";

interface FilePageDataProps {
    records: Record[];
    servers: ServerDef[];
    username: string;
}

interface FilePageEventProps {
    actions: typeof FileActions;
}

type FilePageProps = FilePageDataProps & FilePageEventProps;

interface FilePageState {}

export class FilePageUI extends React.Component<FilePageProps, FilePageState> {
    private serverId: number;
    private filename: string;

    constructor({props, match}) {
        super(props);
        this.serverId = _.toNumber(match.params.serverId);
        this.filename = match.params.filename;
    }

    componentDidMount() {
        const {actions, username} = this.props;
        const server = this.getServer();
        const connection = server.connection;
        connection.addListener('record_state_change', event => onRecordStateChange(event, actions));
        connection.emit('file_state_change', {
           eventType: 'OPEN_FILE',
           file: this.filename,
           userId: username
        });
        fetchRecordsForFile(server, username, this.filename, actions);
    }

    componentWillUnmount() {
        const {username} = this.props;
        const server = this.getServer();
        const connection = server.connection;
        connection.emit('file_state_change', {
            eventType: 'CLOSE_FILE',
            file: this.filename,
            userId: username
        });
    }

    render() {
        const {records} = this.props;
        return <Grid>
            <Panel header={this.getHeader()}>
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
            </Panel>
        </Grid>;
    }

    private getHeader() {
        const s = this.getServer();
        const serverName = `${s.address}:${s.port}`;
        return <h3>{this.filename}<small>{` on ${serverName}`}</small></h3>
    }

    private getServer(): ServerDef {
        const {servers} = this.props;
        return _.find(servers, s => s.id === this.serverId);
    }

    private onCreateNewRecord(record: Record) {
        const {actions, username} = this.props;
        record.filename = this.filename;
        record.serverId = this.serverId;
        createRecordForFile(this.getServer(), username, this.filename, record, actions);
    }

    private onRemoveRecord(record: Record) {
        const {actions, username} = this.props;
        removeRecordForFile(this.getServer(), username, record, actions);
    }

    private onSubmitEditRecord(record: Record) {
        const {actions, username} = this.props;
        editRecordForFile(this.getServer(), username, record, actions);
    }

    private onRecordStatusChange(record: Record, newStatus: RecordStatus) {
        const {username, actions} = this.props;
        const {fileRecordStatusChanged} = actions;
        switch (newStatus) {
            case RecordStatus.EDITING:
                fileRecordStatusChanged({recordId: record.id, newStatus: RecordStatus.WAITING});
                lockRecordForFile(this.getServer(), username, record);
                return;
            case RecordStatus.AVAILABLE:
                unlockRecordForFile(this.getServer(), username, record);
                return;
            default:
                throw new Error(`Unsupported record status: ` + newStatus);
        }
    }
}

function mapStateToProps(state: RootState): FilePageDataProps {
    const {file, start} = state;
    return {
        records: file.records,
        servers: start.servers,
        username: start.username
    };
}

function mapDispatchToProps(dispatch): FilePageEventProps {
    return {
        actions: bindActionCreators(FileActions, dispatch)
    };
}

export const FilePage = connect(
    mapStateToProps,
    mapDispatchToProps
)(FilePageUI as any);
