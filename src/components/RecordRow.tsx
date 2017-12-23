import * as React from "react";
import {Record} from "../types/dtos";

interface RecordRowProps {
    record: Record;
}

interface RecordRowState {}

export class RecordRow extends React.Component<RecordRowProps, RecordRowState> {
    render() {
        const {} = this.props;
        return <li>

        </li>
    }
}