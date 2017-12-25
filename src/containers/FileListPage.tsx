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
import {createFileForServer, fetchFilesForServers} from "../utils/endpoints";

interface FileListPageDataProps {
    files: {[server: number]: File[]},
    servers: ServerDef[];
}

interface FileListPageEventProps {
    actions: typeof FileListActions
}

type FileListPageProps = FileListPageDataProps & FileListPageEventProps;

interface FileListPageState {}

export class FileListPageUI extends React.Component<FileListPageProps, FileListPageState> {

    componentDidMount() {
        const {servers, files, actions} = this.props;
        const loadedServers = _.keys(files);
        if (!_.isEmpty(servers) && _.isEmpty(loadedServers)) {
            fetchFilesForServers(servers, actions);
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
        const {files} = this.props;
        const servers = _.keys(files);
        return <PanelGroup>
            {_.map(servers, (s: number, idx) =>
                <ServerFiles key={idx}
                             server={_.toNumber(s)}
                             eventKey={idx}
                             files={files[s]}
                             onClick={f => this.onFileClick(f)}
                             onRemoveClick={f => this.onRemoveFile(f)}
                             onCreateClick={f => this.onCreateClick(f)}/>
            )}
        </PanelGroup>
    }

    private onFileClick(file: File) {

    }

    private onRemoveFile(file: File) {

    }

    private onCreateClick(file: File) {
        const {servers, actions} = this.props;
        console.log('xxx', _.cloneDeep(file), _.cloneDeep(servers));
        const server = _.find(servers, s => s.id === file.serverId);
        createFileForServer(server, file, actions);
    }

}

function mapStateToProps(state: RootState): FileListPageDataProps {
    const {fileList, start} = state;
    return {
        files: fileList,
        servers: start.servers
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
