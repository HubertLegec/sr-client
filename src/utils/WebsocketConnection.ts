import * as io from 'socket.io-client';
import {ServerDef, ServerStatus} from "../reducers/start";

export class WebsocketConnection {
    private socket: SocketIOClient.Socket;
    private username: string;
    private serverId: number;

    constructor(server: ServerDef, username: string,
                onConnected: () => void) {
        this.username = username;
        this.serverId = server.id;
        this.socket = io(`http://${server.address}:${server.websocketPort}`, {autoConnect: false});
        this.socket.on('connect', () => {
            console.log(`Server #${this.serverId} connected`);
            this.socket.emit('authorize', {userId: this.username});
            onConnected();
        })
    }

    addListener(event: string, callback: Function) {
        this.socket.on(event, callback);
    }

    emit(eventName: string, args: any) {
        console.log(`Emit ${eventName} to server #${this.serverId}`);
        this.socket.emit(eventName, args);
    }

    connect() {
        console.log(`Connecting to server #${this.serverId}`);
        this.socket.connect();
    }

    closeConnection() {
        console.log(`Closing connecting with server #${this.serverId}`);
        this.socket.close();
    }

    get id(): number {
        return this.serverId;
    }
}