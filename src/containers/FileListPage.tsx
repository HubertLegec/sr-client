import * as _ from 'lodash';
import * as React from 'react';
import {bindActionCreators} from "redux";
import {RootState} from "../reducers";
import {connect} from "react-redux";
import {Grid, Panel, PanelGroup} from "react-bootstrap";
import {ServerFiles} from "../components/ServerFiles";
import {File} from "../types/dtos";
import {ServerDef} from "../reducers/start";
import * as FileListActions from "../actions/fileList";
import {createFileForServer, deleteFileForServer, fetchFilesForServers} from "../utils/endpoints";
import {push} from "react-router-redux";

interface FileListPageDataProps {
    files: {[server: number]: File[]};
    servers: ServerDef[];
    username: string;
}

interface FileListPageEventProps {
    actions: typeof FileListActions;
    onFileClick: (file: File) => void;
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
        const {files, onFileClick} = this.props;
        const servers = _.keys(files);
        return <PanelGroup>
            {_.map(servers, (s, idx) =>
                <ServerFiles key={idx}
                             server={this.findServerById(s)}
                             eventKey={idx}
                             files={files[s]}
                             onClick={onFileClick}
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

}

function mapStateToProps(state: RootState): FileListPageDataProps {
    const {fileList, start} = state;
    return {
        files: fileList,
        servers: start.servers,
        username: start.username
    };
}

function mapDispatchToProps(dispatch): FileListPageEventProps {
    return {
        actions: bindActionCreators(FileListActions, dispatch),
        onFileClick(file: File) {
            dispatch(push(`files/${file.serverId}/${file.name}`))
        }
    };
}

export const FileListPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileListPageUI);
