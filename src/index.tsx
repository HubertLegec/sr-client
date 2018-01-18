import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router';
import createHistory from 'history/createBrowserHistory';
import {StartPage} from "./containers/StartPage";
import {FileListPage} from './containers/FileListPage';
import {routerMiddleware, ConnectedRouter} from 'react-router-redux';
import {composeWithDevTools} from "redux-devtools-extension";
import {applyMiddleware, createStore, Store} from "redux";
import rootReducer, {RootState} from "./reducers/index";
import {App} from "./containers/App";
import {NavBar} from "./components/NavBar";
import {NotificationsDispatcher} from "./utils/NotificationsDispatcher";
import {Notifications} from "./components/Notifications";

function configureStore(history, initialState?: RootState) {
    let middleware = applyMiddleware(routerMiddleware(history));
    if (process.env.NODE_ENV === 'development') {
        middleware = composeWithDevTools(middleware);
    }
    const store = createStore(rootReducer, initialState, middleware) as Store<RootState>;
    if (module.hot) {
        module.hot.accept('./reducers', () => {
            const nextReducer = require('./reducers');
            store.replaceReducer(nextReducer);
        });
    }
    return store;
}

export const notificationDispatcher = new NotificationsDispatcher();

const history = createHistory();
const store = configureStore(history);

ReactDOM.render(
    <Provider store={store}>
        <App>
            <Notifications/>
            <NavBar/>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route path="/" exact component={StartPage}/>
                    <Route path="/files" exact component={FileListPage}/>
                </Switch>
            </ConnectedRouter>
        </App>
    </Provider>,
    document.getElementById('root')
);