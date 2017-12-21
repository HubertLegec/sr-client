import * as React from "react";

export class App extends React.Component<{}, {}> {
    render() {
        return <div>
            <div>
                {this.props.children}
            </div>
        </div>;
    }
}