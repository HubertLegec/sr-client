import * as _ from 'lodash';
import * as React from 'react';
import {RootState} from "../reducers";
import {connect} from "react-redux";
import {Grid, Panel, PanelGroup} from "react-bootstrap";
import {ServerFiles} from "../components/ServerFiles";
import {File} from "../types/dtos";

interface FileListPageDataProps {
    files: {[server: string]: File[]}
}

interface FileListPageEventProps {}

type FileListPageProps = FileListPageDataProps & FileListPageEventProps;

interface FileListPageState {}

export class FileListPageUI extends React.Component<FileListPageProps, FileListPageState> {
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
            {_.map(servers, (s, idx) =>
                <ServerFiles key={idx}
                             server={s}
                             eventKey={idx}
                             files={files[s]}
                             onClick={f => this.onFileClick(f)}
                             onRemoveClick={f => this.onRemoveFile(f)}/>
            )}
        </PanelGroup>
    }

    private onFileClick(file: File) {

    }

    private onRemoveFile(file: File) {

    }

}

function mapStateToProps(state: RootState): FileListPageDataProps {
    const {fileList} = state;
    return {
        files: fileList
    };
}

function mapDispatchToProps(dispatch): FileListPageEventProps {
    return {};
}

export const FileListPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileListPageUI);
