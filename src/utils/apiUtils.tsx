import { useSelector } from "react-redux"
import { CounterState } from "../reducer"
import { getCookie, setCookie } from "../cookie"
import { useNavigate } from "react-router-dom"
import { useNotify } from "react-admin"



export const getApi = (apiEndPoint: string, api: string) => {
    return fetch(apiEndPoint + api, {
        headers: {
            "Gauth": getCookie('access')
        }
    })
}

export const postApi = (apiEndPoint: string, api: string, payload: any) => {
    return fetch(apiEndPoint + api, {
        method: 'POST',
        headers : { 'Content-Type' : 'application/json',
                    'Gauth': getCookie('access') },
        body: JSON.stringify(payload)
    })
}

export const putApi = (apiEndPoint: string, api: string, payload: any) => {
    return fetch(apiEndPoint + api, {
        method: 'PUT',
        headers : { 'Content-Type' : 'application/json',
                    'Gauth': getCookie('access') },
        body: JSON.stringify(payload)
    })
}

export const deleteApi = (apiEndPoint: string, api: string) => {
    return fetch(apiEndPoint + api, {
        method: 'DELETE',
        headers : { 'Content-Type' : 'application/json',
                    'Gauth': getCookie('access') }
    })
}

export const refreshApi = async (apiEndPoint: string, notify: Function, navigate: Function) => {
    const response = await fetch(`${apiEndPoint}/api/update/token`,
        {
            headers: {
                'Refresh': getCookie('refresh')
            }
        }
    )
    if (response.status === 401) {
        navigate('/login')
        notify('Login time has expired')
        throw new Error('로그아웃')
    }
    else if (response.status === 200) {
        let jwtToken: string | null = response.headers.get('Gauth')
        let refreshToken: string | null = response.headers.get('RefreshToken')

        if (jwtToken) {
            setCookie('access', jwtToken)
        }

        if (refreshToken) {
            setCookie('refresh', refreshToken)
        }
    }
}
