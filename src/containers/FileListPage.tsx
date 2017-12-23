import * as _ from 'lodash';
import * as React from 'react';
import {RootState} from "../reducers/index";
import {connect} from "react-redux";

interface FileListPageDataProps {
    files: {[server: string]: File[]}
}

interface FileListPageEventProps {}

type FileListPageProps = FileListPageDataProps & FileListPageEventProps;

interface FileListPageState {}

export class FileListPageUI extends React.Component<FileListPageProps, FileListPageState> {
    render() {
        return <div>Hello!</div>;
    }
}

function mapStateToProps(state: RootState): FileListPageDataProps {
    const {fileList} = state;
    return {
        files: _.assign({}, fileList)
    };
}

function mapDispatchToProps(dispatch): FileListPageEventProps {
    return {};
}

export const FileListPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileListPageUI);
