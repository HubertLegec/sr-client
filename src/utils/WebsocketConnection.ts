import * as io from 'socket.io-client';
import {ServerDef, ServerStatus} from "../reducers/start";

export class WebsocketConnection {
    private socket: SocketIOClient.Socket;
    private username: string;
    private serverId: number;

    constructor(server: ServerDef, username: string,
                updateServerState: (payload: {id: number, status: ServerStatus}) => void) {
        this.username = username;
        this.serverId = server.id;
        this.socket = io(`http://${server.address}:${server.port}`, {autoConnect: false});
        this.socket.on('connect', () => {
            console.log(`Server #${this.serverId} connected`);
            this.socket.emit('authorize', {userId: this.username});
            updateServerState({id: this.serverId, status: ServerStatus.CONNECTED});
        })
    }

    addListener(event: string, callback: Function) {
        this.socket.on(event, callback);
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