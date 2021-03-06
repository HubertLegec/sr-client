import * as _ from "lodash";
import * as React from "react";
import {Col, ListGroupItem, Row, FormControl} from "react-bootstrap";
import {File, Record} from "../types/dtos";
import {GlyphButton} from "./GlyphButton";
import {FileRecords} from "./FileRecords";
import {ServerDef} from "../reducers/start";
import * as FileListActions from "../actions/fileList";

interface FileRowProps {
    isNewElement?: boolean;
    file?: File;
    records?: Record[];
    onClick?: (file: File) => void;
    onRemove?: (file: File) => void;
    onCreate?: (file: File) => void;
    username: string;
    server?: ServerDef;
    actions?: typeof FileListActions;
}

interface FileRowState {
    filename: string;
}

export class FileRow extends React.Component<FileRowProps, FileRowState> {

    constructor(props: FileRowProps) {
        super(props);
        this.state = {
            filename: undefined
        }
    }

    render() {
        const {isNewElement, file} = this.props;
        return <ListGroupItem href="#" disabled={isNewElement}>
            {isNewElement ? this.renderNew() : this.renderExisting()}
        </ListGroupItem>;
    }

    private renderExisting() {
        const {file, onClick, onRemove} = this.props;
        if (file.isOpened) {
            return this.renderOpened();
        }
        return <Row className="show-grid">
            <Col xs={10} md={10}>
                <FormControl.Static onClick={() => onClick(file)}>
                    {file.name}
                </FormControl.Static>
            </Col>
            <Col xs={2} md={2}>
                <GlyphButton glyphName="glyphicon-trash"
                             onClick={() => onRemove(file)}/>
            </Col>
        </Row>;
    }

    private renderNew() {
        return <Row className="show-grid">
            <Col xs={10} md={10}>
                <FormControl type="text"
                             placeholder="File name"
                             value={this.state.filename}
                             onChange={e => this.onFileNameChange(e)}/>
            </Col>
            <Col xs={2} md={2}>
                <GlyphButton glyphName="glyphicon-save"
                             disabled={_.isEmpty(this.state.filename)}
                             onClick={() => this.onCreateNewFile()}/>
            </Col>
        </Row>;
    }

    private renderOpened() {
        const {file, username, server, actions, onClick, records} = this.props;
        return <FileRecords filename={file.name}
                            username={username}
                            records={records}
                            server={server}
                            onClick={() => onClick(file)}
                            actions={actions}/>

    }

    private onFileNameChange(e: any) {
        const newName = e.target.value;
        this.setState({
            filename: newName
        })
    }

    private onCreateNewFile() {
        const {onCreate} = this.props;
        const file: File = {
            name: this.state.filename
        };
        onCreate(file);
    }
}