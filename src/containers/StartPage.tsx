import * as _ from "lodash";
import * as React from "react";
import {RootState} from "../reducers";
import {connect} from "react-redux";
import {ServerDef} from "../reducers/start";
import {Button, ButtonToolbar, Col, FormControl, Grid, ListGroup, Panel, Row} from "react-bootstrap";
import {bindActionCreators} from "redux";
import * as StartActions from "../actions/start";
import {ServerRow} from "../components/ServerRow";

interface StartPageDataProps {
    username: string;
    servers: ServerDef[];
}

interface StartPageEventProps {
    actions: typeof StartActions
}

type StartPageProps = StartPageDataProps & StartPageEventProps;

interface StartPageState {}

export class StartPageUI extends React.Component<StartPageProps, StartPageState> {
    render() {
        const {username, servers, actions} = this.props;
        const {addServer, removeServer, setUsername} = actions;
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
                    <Button bsStyle="primary">Connect</Button>
                </ButtonToolbar>
            </Row>
        </Grid>;
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
        actions: bindActionCreators(StartActions as any, dispatch),
    };
}

export const StartPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(StartPageUI);