import * as _ from "lodash";

export function getJson(path: string, usedId: string, queryParams?: { [key: string]: any }): Promise<any> {
    const queryUrl = getUrl(path, queryParams);
    return fetch(queryUrl, {
        headers: {
            'userId': usedId
        }
    }).then(result => {
        if (result.ok) {
            return result;
        } else {
            console.error(`Error occured during GET operation, status: ${result.status}, ${result.json()}`)
        }
    }).then(result => result.json());
}

function getUrl(path: string, params?: { [key: string]: any }): string {
    if (params) {
        const params = new URLSearchParams();
        _.toPairs(params)
            .forEach(entry =>
                params.append(entry[0], entry[1])
            );
        return `${path}?${params.toString()}`
    }
    return path
}


export function postJson(path: string, userId: string, body?: any): Promise<any> {
    return fetch(path, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'userId': userId
        } as any,
        method: "POST",
        body: JSON.stringify(body)
    }).then(result => {
        if (result.ok) {
            return result;
        } else {
            console.error(`Error occured during POST operation, status: ${result.status}, ${result.json()}`)
        }
    }).then(result => result.json());
}

export function putJson(path: string, userId: string, body?: any): Promise<any> {
    return fetch(path,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'userId': userId
            } as any,
            method: "PUT",
            body: JSON.stringify(body)
        }).then(result => result.json());
}

export function deleteJson(path: string, userId: string): Promise<any> {
    return fetch(path, {
        headers: {
            'userId': userId
        },
        method: 'DELETE'
    }).then(result => result.json());
}