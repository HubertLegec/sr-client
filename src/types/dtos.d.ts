
export interface File {
    name: string;
    serverId?: number;
}

export interface Record {
    id?: number;
    serverId?: number;
    filename?: string;
    content: string;
}