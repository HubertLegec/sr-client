import * as _ from "lodash";
import * as React from "react";
import {RootState} from "../reducers";
import {connect} from "react-redux";
import {ServerDef, ServerStatus} from "../reducers/start";
import {Button, ButtonToolbar, Col, FormControl, Grid, ListGroup, Panel, Row} from "react-bootstrap";
import {bindActionCreators} from "redux";
import * as StartActions from "../actions/start";
import * as FileListActions from "../actions/fileList";
import {ServerRow} from "../components/ServerRow";
import {WebsocketConnection} from "../utils/WebsocketConnection";
import {notificationDispatcher} from "../index";
import {NotificationLevel} from "../utils/NotificationsDispatcher";
import {push} from "react-router-redux";
import {onRecordStateChange} from "../utils/eventListeners";

interface StartPageDataProps {
    username: string;
    servers: ServerDef[];
}

interface StartPageEventProps {
    actions: typeof StartActions;
    fileListActions: typeof FileListActions,
    onFilesButtonClick: () => void;
}

type StartPageProps = StartPageDataProps & StartPageEventProps;

interface StartPageState {
}

export class StartPageUI extends React.Component<StartPageProps, StartPageState> {
    render() {
        const {username, servers, actions, onFilesButtonClick} = this.props;
        const {addServer, removeServer, setUsername} = actions;
        const allConnected = !_.isEmpty(servers) && _.every(servers, s => s.status === ServerStatus.CONNECTED);
        return <Grid>
            <Row className="show-grid">
                <Col md={6} mdPush={6}>
                    <Panel header={<h3>Login</h3>}>
                        <FormControl type="text"
                                     placeholder="Enter username..."
                                     value={username}
                                     onChange={(e: any) => setUsername(e.target.value)}/>
                    </Panel>
                </Col>
                <Col md={6} mdPull={6}>
                    <Panel header={<h3>Servers</h3>}>
                        <ListGroup fill>
                            {_.map(servers, server =>
                                <ServerRow key={server.id} server={server}
                                           onRemove={s => removeServer(s)}/>
                            )}
                            <ServerRow isNewElement={true} onCreate={s => addServer(s)}/>
                        </ListGroup>
                    </Panel>
                </Col>
            </Row>
            <Row className="show-grid">
                <ButtonToolbar>
                    <Button disabled={_.isEmpty(username)}
                            bsStyle="primary"
                            onClick={() => this.connectToServers()}>Connect</Button>
                    {allConnected && <Button onClick={onFilesButtonClick}>Files</Button>}
                </ButtonToolbar>
            </Row>
        </Grid>;
    }

    private connectToServers() {
        const {servers, actions, username, fileListActions} = this.props;
        const {updateServerState, addWebsocketConnection} = actions;
        console.log('--- Connect to servers ---', _.cloneDeep(servers));
        servers
            .map(s => {
                updateServerState({id: s.id, status: ServerStatus.CONNECTING});
                return s;
            })
            .map(s => {
                const c = new WebsocketConnection(s, username, () => {
                    updateServerState({id: s.id, status: ServerStatus.CONNECTED});
                    notificationDispatcher.publishNotification(
                        "New connection",
                        `Server #${s.id} connected`,
                        NotificationLevel.SUCCESS
                    )
                });
                c.addListener('record_state_change', event => {
                    onRecordStateChange(event, s, fileListActions);
                    notificationDispatcher.publishNotification("Record state change", event.eventType, NotificationLevel.INFO)
                });
                return c;
            })
            .map(c => {
                c.connect();
                return c;
            })
            .forEach(c => addWebsocketConnection(c));
    }
}

function mapStateToProps(state: RootState): StartPageDataProps {
    const {start} = state;
    return {
        username: start.username,
        servers: start.servers
    };
}

function mapDispatchToProps(dispatch): StartPageEventProps {
    return {
        actions: bindActionCreators(StartActions, dispatch),
        fileListActions: bindActionCreators(FileListActions, dispatch),
        onFilesButtonClick() {
            dispatch(push("/files"))
        }
    };
}

export const StartPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(StartPageUI);