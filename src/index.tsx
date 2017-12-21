import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router';
import createHistory from 'history/createBrowserHistory';
import {MainPage} from './containers/MainPage';
import {routerMiddleware, ConnectedRouter} from 'react-router-redux';
import {composeWithDevTools} from "redux-devtools-extension";
import {applyMiddleware, createStore, Store} from "redux";
import rootReducer, {RootState} from "./reducers/index";
import {App} from "./containers/App";

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

const history = createHistory();
const store = configureStore(history);

ReactDOM.render(
    <Provider store={store}>
        <App>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route path="/" component={MainPage}/>
                </Switch>
            </ConnectedRouter>
        </App>
    </Provider>,
    document.getElementById('root')
);