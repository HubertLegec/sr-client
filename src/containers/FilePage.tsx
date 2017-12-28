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
import {createRecordForFile, fetchRecordsForFile, removeRecordForFile} from "../utils/endpoints";
import {newRecordForFile} from "../actions/file";

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
        const {newRecordForFile, recordForFileRemoved} = actions;
        const server = this.getServer();
        const connection = server.connection;
        connection.addListener('record_state_change', event => {
            const eventType = event.eventType;
            switch (eventType) {
                case 'RECORD_CREATED':
                    const record = event.record;
                    newRecordForFile(record);
                    return;
                case 'RECORD_REMOVED':
                    const recId = event.recordId;
                    recordForFileRemoved(recId);
                    return;
            }
        });
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
                                   onEdit={r => this.onEditRecord(r)}
                                   onRemove={r => this.onRemoveRecord(r)}/>
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

    private onEditRecord(record: Record) {

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
