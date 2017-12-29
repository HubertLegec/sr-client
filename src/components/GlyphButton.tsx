import * as React from "react";
import {Button, Glyphicon} from "react-bootstrap";

interface GlyphButtonProps {
    disabled?: boolean;
    glyphName: string;
    onClick: () => void;
}

interface GlyphButtonState {}

export class GlyphButton extends React.Component<GlyphButtonProps, GlyphButtonState> {
    render() {
        const {disabled, onClick, glyphName} = this.props;
        return <Button disabled={disabled} onClick={onClick}>
            <Glyphicon glyph={`glyphicon ${glyphName}`} />
        </Button>;
    }
}
