import * as _ from "lodash";
import * as React from "react";
import {RootState} from "../reducers/index";
import {connect} from "react-redux";
import {Record} from "../types/dtos";
import {RecordRow} from "../components/RecordRow";

interface FilePageDataProps {
    records: Record[];
    filename: string;
}

interface FilePageEventProps {

}

type FilePageProps = FilePageDataProps & FilePageEventProps;

interface FilePageState {
}

export class FilePageUI extends React.Component<FilePageProps, FilePageState> {
    render() {
        return <div>
            {this.renderFileName()}
            {this.renderRecordsList()}
        </div>;
    }

    private renderFileName() {
        const {filename} = this.props;
        return <div>
            {filename}
        </div>
    }

    private renderRecordsList() {
        const {records} = this.props;
        return <div>
            <ul>
                {_.map(records, r =>
                    <RecordRow record={r}/>
                )}
            </ul>
        </div>
    }
}

function mapStateToProps(state: RootState): FilePageDataProps {
    const {file} = state;
    return {
        records: file.records,
        filename: ""
    };
}

function mapDispatchToProps(dispatch): FilePageEventProps {
    return {};
}

export const FilePage = connect(
    mapStateToProps,
    mapDispatchToProps
)(FilePageUI);
