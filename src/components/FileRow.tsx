import * as _ from "lodash";
import * as React from "react";
import {Button, Col, Glyphicon, ListGroupItem, Row, FormControl} from "react-bootstrap";
import {File} from "../types/dtos";

interface FileRowProps {
    isNewElement?: boolean;
    file?: File;
    onClick?: (file: File) => void;
    onRemove?: (file: File) => void;
    onCreate?: (file: File) => void;
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
        const {isNewElement} = this.props;
        return <ListGroupItem>
            {isNewElement ? this.renderNew() : this.renderExisting()}
        </ListGroupItem>;
    }

    private renderExisting() {
        const {file, onClick, onRemove} = this.props;
        return <Row className="show-grid">
            <Col xs={10} md={10}>
                <FormControl.Static onClick={() => onClick(file)}>
                    {file.name}
                </FormControl.Static>
            </Col>
            <Col xs={2} md={2}>
                <Button onClick={() => onRemove(file)}>
                    <Glyphicon glyph="glyphicon glyphicon-remove-sign"/>
                </Button>
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
                <Button disabled={_.isEmpty(this.state.filename)} onClick={() => this.onCreateNewFile()}>
                    <Glyphicon glyph="glyphicon glyphicon-ok-sign"/>
                </Button>
            </Col>
        </Row>;
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