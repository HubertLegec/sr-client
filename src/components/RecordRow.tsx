import * as _ from "lodash";
import * as React from "react";
import {Record} from "../types/dtos";
import {Col, FormControl, ListGroupItem, Row} from "react-bootstrap";
import {RecordStatus} from "../types/enumerates";
import {GlyphButton} from "./GlyphButton";

interface RecordRowProps {
    isNewItem?: boolean;
    record?: Record;
    onCreate?: (record: Record) => void;
    onRemove?: (record: Record) => void;
    onStatusChange?: (record: Record, status: RecordStatus) => void;
    onSubmitEdit?: (record: Record) => void;
}

interface RecordRowState {
    recordContent: string;
}

export class RecordRow extends React.Component<RecordRowProps, RecordRowState> {

    constructor(props: RecordRowProps) {
        super(props);
        const record = props.record;
        this.state = {
            recordContent: record ? record.content : undefined
        };
    }

    render() {
        const {isNewItem} = this.props;
        return <ListGroupItem>
            {isNewItem ? this.renderNew() : this.renderExisting()}
        </ListGroupItem>
    }

    private renderExisting() {
        const {record} = this.props;
        return <Row className="show-grid">
            {record.status === RecordStatus.EDITING ? this.renderEditing() : this.renderReadOnly()}
        </Row>;
    }

    private renderEditing() {
        const {record, onStatusChange, onRemove} = this.props;
        return <Row className="show-grid">
            <Col xs={1} md={1}>
                <FormControl.Static style={{marginLeft: '10px'}}>
                    {record.id}
                </FormControl.Static>
            </Col>
            <Col xs={8} md={8}>
                <FormControl type="text"
                             placeholder="Record content"
                             value={this.state.recordContent}
                             onChange={e => this.onContentChange(e)}/>
            </Col>
            <Col xs={1} md={1}>
                <GlyphButton glyphName="glyphicon-remove"
                             onClick={() => onStatusChange(record, RecordStatus.AVAILABLE)}/>
            </Col>
            <Col xs={1} md={1}>
                <GlyphButton glyphName="glyphicon-ok"
                             onClick={() => this.onSubmitEditRecord()}/>
            </Col>
            <Col xs={1} md={1}>
                <GlyphButton glyphName="glyphicon-trash"
                             onClick={() => onRemove(record)}/>
            </Col>
        </Row>;
    }

    private renderReadOnly() {
        const {record, onStatusChange} = this.props;
        return <Row className="show-grid">
            <Col xs={1} md={1}>
                <FormControl.Static style={{marginLeft: '10px'}}>
                    {record.id}
                </FormControl.Static>
            </Col>
            <Col xs={9} md={9}>
                <FormControl.Static>
                    {record.content}
                </FormControl.Static>
            </Col>
            <Col xs={2} md={2}>
                <GlyphButton glyphName={this.getGlyphIconName()}
                             disabled={record.status === RecordStatus.WAITING}
                             onClick={() => onStatusChange(record, RecordStatus.EDITING)}/>
            </Col>
        </Row>;
    }

    private getGlyphIconName(): string {
        const {record} = this.props;
        return record.status === RecordStatus.WAITING ? "glyphicon-hourglass" : "glyphicon-edit";
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
                <GlyphButton glyphName="glyphicon-save"
                             onClick={() => this.onCreateNewRecord()}/>
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
            content: this.state.recordContent,
            status: RecordStatus.AVAILABLE
        };
        onCreate(record);
    }

    private onSubmitEditRecord() {
        const {onSubmitEdit, record} = this.props;
        const editedRecord: Record = _.assign({}, record, {
            content: this.state.recordContent
        });
        onSubmitEdit(editedRecord);
    }
}