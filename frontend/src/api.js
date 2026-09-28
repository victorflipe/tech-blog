export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const getToken = () => window.localStorage.getItem('token')

const authHeaders = () => {
    const token = getToken()
    return token ? { Authorization: 'Bearer ' + token } : {}
}

export const LOGIN_USER = (body) => {
    return {
        url: API_URL + '/login/',
        options: {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        },
    }
}

export const GET_USER = () => {
    return {
        url: API_URL + '/users/getuser',
        options: {
            method: 'get',
            headers: {
                ...authHeaders(),
            },
        },
    }
}

export const GET_TAGS = () => {
    return {
        url: API_URL + '/tags/',
        options: {
            method: 'get',
        },
    }
}

export const GET_ARTICLES = (skip, limit) => {
    return {
        url: API_URL + `/articles?skip=${skip}&limit=${limit}`,
        options: {
            method: 'get',
            headers: {
                ...authHeaders(),
            },
        },
    }
}

export const GET_ARTICLE = (articleId) => {
    return {
        url: API_URL + `/articles/${articleId}`,
        options: {
            method: 'get',
            headers: {
                ...authHeaders(),
            },
        },
    }
}

export const GET_COMMENTS = (articleId) => {
    return {
        url: API_URL + `/articles/${articleId}/comments`,
        options: {
            method: 'get',
            headers: {
                ...authHeaders(),
            },
        },
    }
}

export const POST_COMMENT = (articleId, body) => {
    return {
        url: API_URL + `/articles/${articleId}/comments`,
        options: {
            method: 'post',
            headers: {
                ...authHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        },
    }
}

export const DELETE_COMMENT = (commentId) => {
    return {
        url: API_URL + `/comments/${commentId}`,
        options: {
            method: 'delete',
            headers: {
                ...authHeaders(),
            },
        },
    }
}

export const POST_ARTICLE = (body) => {
    return {
        url: API_URL + '/articles/',
        options: {
            method: 'post',
            headers: {
                ...authHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        },
    }
}

export const UPDATE_ARTICLE = (articleId, body) => {
    return {
        url: API_URL + `/articles/${articleId}`,
        options: {
            method: 'put',
            headers: {
                ...authHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        },
    }
}
