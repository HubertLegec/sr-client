import * as _ from "lodash";
import * as React from "react";
import {ServerDef, ServerStatus} from "../reducers/start";
import {Button, Col, FormControl, Glyphicon, ListGroupItem, Row} from "react-bootstrap";

interface ServerRowProps {
    isNewElement?: boolean;
    server?: ServerDef;
    onCreate?: (server: ServerDef) => void;
    onRemove?: (server: ServerDef) => void;
}

interface ServerRowState {
    address: string;
    port: string;
}

export class ServerRow extends React.Component<ServerRowProps, ServerRowState> {
    private addresInputRef;
    private portInputRef;

    constructor(props: ServerRowProps) {
        super(props);
        this.state = {
            address: undefined,
            port: undefined
        }
    }

    render() {
        const {isNewElement} = this.props;
        return <ListGroupItem>
            {isNewElement ? this.renderNew() : this.renderExisting()}
        </ListGroupItem>;
    }

    private renderNew() {
        return <Row className="show-grid">
            <Col xs={5} md={5}>
                <FormControl type="text"
                             placeholder="Server address"
                             value={this.state.address}
                             inputRef={ref => {this.addresInputRef = ref}}
                             onChange={e => this.onChangeInput("address", e)}/>
            </Col>
            <Col xs={5} md={5}>
                <FormControl type="text"
                             placeholder="Server port"
                             value={this.state.port}
                             inputRef={ref => {this.portInputRef = ref}}
                             onChange={e => this.onChangeInput("port", e)}/>
            </Col>
            <Col xs={2} md={2}>
                <Button disabled={_.isEmpty(this.state.port)} onClick={() => this.onSaveServer()}>
                    <Glyphicon glyph="glyphicon glyphicon-ok-sign"/>
                </Button>
            </Col>
        </Row>;
    }

    private renderExisting() {
        const {onRemove, server} = this.props;
        return <Row className="show-grid">
            <Col xs={4} md={4}>
                <FormControl.Static>
                    {server.address}
                </FormControl.Static>
            </Col>
            <Col xs={4} md={4}>
                <FormControl.Static>
                    {server.port}
                </FormControl.Static>
            </Col>
            <Col xs={2} md={2}>
                {this.renderStatusImage()}
            </Col>
            <Col xs={2} md={2}>
                <Button onClick={() => onRemove(server)}>
                    <Glyphicon glyph="glyphicon glyphicon-remove-sign"/>
                </Button>
            </Col>
        </Row>;
    }

    private renderStatusImage() {
        const {status} = this.props.server;
        switch (status) {
            case ServerStatus.CREATED:
                return <Glyphicon glyph="glyphicon glyphicon-asterisk"/>;
            case ServerStatus.CONNECTING:
                return <Glyphicon glyph="glyphicon glyphicon-refresh"/>;
            case ServerStatus.CONNECTED:
                return <Glyphicon glyph="glyphicon glyphicon-ok"/>;
            case ServerStatus.DISCONNECTED:
                return <Glyphicon glyph="glyphicon glyphicon-alert"/>;
        }
    }

    private onChangeInput(field: string, event: any) {
        this.setState(_.assign({}, this.state, {
            [field]: event.target.value
        }))
    }

    private onSaveServer() {
        const {onCreate} = this.props;
        const server: ServerDef = {
            address: this.state.address,
            port: this.state.port,
            status: ServerStatus.CREATED,
            connection: undefined
        };
        this.setState({
            address: undefined,
            port: undefined
        });
        this.addresInputRef.text = undefined;
        this.portInputRef.text = undefined;
        onCreate(server);
    }
}