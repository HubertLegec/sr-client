import * as React from 'react';
import {RootState} from "../../reducers";
import {connect} from "react-redux";

interface MainPageDataProps {}

interface MainPageEventProps {}

type MainPageProps = MainPageDataProps & MainPageEventProps;

interface MainPageState {}

export class MainPageUI extends React.Component<MainPageProps, MainPageState> {
    render() {
        return <div>Hello!</div>;
    }
}

function mapStateToProps(state: RootState): MainPageDataProps {
    return {};
}

function mapDispatchToProps(dispatch): MainPageEventProps {
    return {};
}

export const MainPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPageUI);
