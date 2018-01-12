import * as _ from "lodash";
import * as React from "react";
import {ServerDef, ServerStatus} from "../reducers/start";
import {Col, FormControl, Glyphicon, ListGroupItem, Row} from "react-bootstrap";
import {GlyphButton} from "./GlyphButton";

interface ServerRowProps {
    isNewElement?: boolean;
    server?: ServerDef;
    onCreate?: (server: ServerDef) => void;
    onRemove?: (server: ServerDef) => void;
}

interface ServerRowState {
    address: string;
    port: string;
    websocketPort: string;
}

export class ServerRow extends React.Component<ServerRowProps, ServerRowState> {
    private addresInputRef;
    private portInputRef;
    private webPortInputRef;

    constructor(props: ServerRowProps) {
        super(props);
        this.state = {
            address: 'localhost',
            port: '4200',
            websocketPort: '4200'
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
            <Col xs={4} md={4}>
                <FormControl type="text"
                             placeholder="Server address"
                             value={this.state.address}
                             inputRef={ref => {this.addresInputRef = ref}}
                             onChange={e => this.onChangeInput("address", e)}/>
            </Col>
            <Col xs={3} md={3}>
                <FormControl type="text"
                             placeholder="Server port"
                             value={this.state.port}
                             inputRef={ref => {this.portInputRef = ref}}
                             onChange={e => this.onChangeInput("port", e)}/>
            </Col>
            <Col xs={3} md={3}>
                <FormControl type="text"
                             placeholder="Websocket port"
                             value={this.state.websocketPort}
                             inputRef={ref => {this.webPortInputRef = ref}}
                             onChange={e => this.onChangeInput("websocketPort", e)}/>
            </Col>
            <Col xs={2} md={2}>
                <GlyphButton glyphName="glyphicon-save"
                             disabled={_.isEmpty(this.state.port)}
                             onClick={() => this.onSaveServer()}/>
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
            <Col xs={2} md={2}>
                <FormControl.Static>
                    {server.port}
                </FormControl.Static>
            </Col>
            <Col xs={2} md={2}>
                <FormControl.Static>
                    {server.websocketPort}
                </FormControl.Static>
            </Col>
            <Col xs={2} md={2}>
                {this.renderStatusImage()}
            </Col>
            <Col xs={2} md={2}>
                <GlyphButton glyphName="glyphicon-trash"
                             onClick={() => onRemove(server)}/>
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
            websocketPort: this.state.websocketPort,
            status: ServerStatus.CREATED,
            connection: undefined
        };
        onCreate(server);
    }
}