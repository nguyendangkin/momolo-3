import queryString from "query-string";

export interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
    cache?: RequestCache;
    next?: NextFetchRequestConfig;
}

export const sendRequest = async <T>(props: IRequest) => {
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {},
        cache,
        next,
    } = props;

    const options: any = {
        method: method,
        headers: new Headers({
            "content-type": "application/json",
            ...headers,
        }),
        body: body ? JSON.stringify(body) : null,
        ...(cache && { cache }),
        ...(next && { next }),
        ...nextOption,
    };
    if (useCredentials) options.credentials = "include";

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then((res) => {
        if (res.ok) {
            return res.json() as T;
        } else {
            return res.json().then(function (json) {
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? "",
                } as T;
            });
        }
    });
};

export const sendRequestFile = async <T>(props: IRequest) => {
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {},
        cache,
        next,
    } = props;

    const options: any = {
        method: method,
        headers: new Headers({ ...headers }),
        body: body ? body : null,
        ...(cache && { cache }),
        ...(next && { next }),
        ...nextOption,
    };
    if (useCredentials) options.credentials = "include";

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then((res) => {
        if (res.ok) {
            return res.json() as T;
        } else {
            return res.json().then(function (json) {
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? "",
                } as T;
            });
        }
    });
};
