import * as React from "react";
import {Button, Col, Glyphicon, ListGroupItem, Row, FormControl} from "react-bootstrap";
import {File} from "../types/dtos";

interface FileRowProps {
    file: File;
    onClick: (file: File) => void;
    onRemove: (file: File) => void;
}

interface FileRowState {}

export class FileRow extends React.Component<FileRowProps, FileRowState> {
    render() {
        const {file, onClick, onRemove} = this.props;
        return <ListGroupItem>
            <Row className="show-grid">
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
            </Row>
        </ListGroupItem>;
    }
}