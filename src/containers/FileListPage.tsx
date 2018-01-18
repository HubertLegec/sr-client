import * as _ from 'lodash';
import * as React from 'react';
import {bindActionCreators} from "redux";
import {RootState} from "../reducers";
import {connect} from "react-redux";
import {Grid, Panel, PanelGroup} from "react-bootstrap";
import {ServerFiles} from "../components/ServerFiles";
import {File, Record} from "../types/dtos";
import {ServerDef} from "../reducers/start";
import * as FileListActions from "../actions/fileList";
import {createFileForServer, deleteFileForServer, fetchFilesForServers, fetchRecordsForFile} from "../utils/endpoints";

interface FileListPageDataProps {
    files: {[server: number]: File[]};
    records: Record[];
    servers: ServerDef[];
    username: string;
}

interface FileListPageEventProps {
    actions: typeof FileListActions;
}

type FileListPageProps = FileListPageDataProps & FileListPageEventProps;

interface FileListPageState {}

export class FileListPageUI extends React.Component<FileListPageProps, FileListPageState> {

    componentDidMount() {
        const {servers, actions, username} = this.props;
        if (!_.isEmpty(servers)) {
            fetchFilesForServers(servers, username, actions);
        }
    }

    render() {
        const {files} = this.props;
        const servers = _.keys(files);
        return <Grid>
            {_.isEmpty(servers) ? this.renderNoServers() : this.renderFileList()}
        </Grid>;
    }

    private renderNoServers() {
        return <Panel header="Error" bsStyle="danger">
            You are not connected to any server
        </Panel>
    }

    private renderFileList() {
        const {files, username, actions} = this.props;
        const servers = _.keys(files);
        return <PanelGroup>
            {_.map(servers, (s, idx) =>
                <ServerFiles key={idx}
                             server={this.findServerById(s)}
                             eventKey={idx}
                             files={files[s]}
                             records={this.findRecordsForServer(s)}
                             username={username}
                             actions={actions}
                             onClick={f => this.onFileClicked(f, s)}
                             onRemoveClick={f => this.onRemoveFile(f)}
                             onCreateClick={f => this.onCreateClick(f)}/>
            )}
        </PanelGroup>
    }

    private findServerById(serverId: string): ServerDef {
        const {servers} = this.props;
        const id = _.toNumber(serverId);
        return _.find(servers, s => s.id === id);
    }

    private findRecordsForServer(serverId: string): Record[] {
        const {records} = this.props;
        const id = this.findServerById(serverId).id;
        return _.filter(records, r => r.serverId === id);
    }

    private onRemoveFile(file: File) {
        const {servers, actions, username} = this.props;
        const server = _.find(servers, s => s.id === file.serverId);
        deleteFileForServer(server, username, file, actions);
    }

    private onCreateClick(file: File) {
        const {servers, actions, username} = this.props;
        const server = _.find(servers, s => s.id === file.serverId);
        createFileForServer(server, username, file, actions);
    }

    private onFileClicked(file: File, serverId: string) {
        const {actions, username} = this.props;
        const opened = file.isOpened;
        const server = this.findServerById(serverId);
        actions.fileClicked({server: serverId, filename: file.name});
        const connection = server.connection;
        if (opened) {
            connection.emit('file_state_change', {
                eventType: 'CLOSE_FILE',
                file: file.name,
                userId: username
            });
            actions.removeFileRecords({server: server.id, file: file});
        } else {
            connection.emit('file_state_change', {
                eventType: 'OPEN_FILE',
                file: file.name,
                userId: username
            });
            fetchRecordsForFile(server, username, file.name, actions);
        }
    }

}

function mapStateToProps(state: RootState): FileListPageDataProps {
    const {fileList, start, file} = state;
    return {
        files: fileList,
        servers: start.servers,
        username: start.username,
        records: file.records
    };
}

function mapDispatchToProps(dispatch): FileListPageEventProps {
    return {
        actions: bindActionCreators(FileListActions, dispatch)
    };
}

export const FileListPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileListPageUI);
