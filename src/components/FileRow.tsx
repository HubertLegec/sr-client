import * as React from "react";

interface FileRowProps {
    name: string;
    onClick: (name: string) => void;
    onRemove: (name: string) => void;
}

interface FileRowState {}

export class FileRow extends React.Component<FileRowProps, FileRowState> {
    render() {
        const {name, onClick, onRemove} = this.props;
        return <div></div>;
    }
}