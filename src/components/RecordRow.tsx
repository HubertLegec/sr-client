import * as React from "react";
import {Record} from "../types/dtos";
import {Button, Col, FormControl, Glyphicon, ListGroupItem, Row} from "react-bootstrap";

interface RecordRowProps {
    isNewItem?: boolean;
    record?: Record;
    onCreate?: (record: Record) => void;
    onRemove?: (record: Record) => void;
    onEdit?: (record: Record) => void;
}

interface RecordRowState {
    recordContent: string;
}

export class RecordRow extends React.Component<RecordRowProps, RecordRowState> {

    constructor(props: RecordRowProps) {
        super(props);
        this.state = {
            recordContent: undefined
        };
    }

    render() {
        const {isNewItem} = this.props;
        return <ListGroupItem>
            {isNewItem ? this.renderNew() : this.renderExisting()}
        </ListGroupItem>
    }

    private renderExisting() {
        const {record, onRemove, onEdit} = this.props;
        return <Row className="show-grid">
            <Col xs={1} md={1}>
                <FormControl.Static>
                    {record.id}
                </FormControl.Static>
            </Col>
            <Col xs={7} md={7}>
                <FormControl.Static>
                    {record.content}
                </FormControl.Static>
            </Col>
            <Col xs={2} md={2}>
                <Button onClick={() => onEdit(record)}>
                    <Glyphicon glyph="glyphicon glyphicon-remove-sign"/>
                </Button>
            </Col>
            <Col xs={2} md={2}>
                <Button onClick={() => onRemove(record)}>
                    <Glyphicon glyph="glyphicon glyphicon-remove-sign"/>
                </Button>
            </Col>
        </Row>
    }

    private renderNew() {
        return <Row className="show-grid">
            <Col xs={10} md={10}>
                <FormControl type="text"
                             placeholder="Record content"
                             value={this.state.recordContent}
                             onChange={e => this.onContentChange(e)}/>
            </Col>
            <Col xs={2} md={2}>
                <Button onClick={() => this.onCreateNewRecord()}>
                    <Glyphicon glyph="glyphicon glyphicon-ok-sign"/>
                </Button>
            </Col>
        </Row>
    }

    private onContentChange(e: any) {
        const text = e.target.value;
        this.setState({
            recordContent: text
        })
    }

    private onCreateNewRecord() {
        const {onCreate} = this.props;
        const record: Record = {
            content: this.state.recordContent
        };
        onCreate(record);
    }
}