import { useQuery, useQueryClient } from 'react-query';
import React, { FC, useEffect } from 'react'
import { setCookie } from '../cookie';

interface loginPayload {
    authCode: string;
}

export const LoginApi = (api: string, value: loginPayload) => {
    const { status, data, error } = useQuery('googleLogin', () => fetch(`${api}/api/login/google`, {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(value)
    }).then((response) => {
        let jwtToken: string | null = response.headers.get('Gauth')
        if (jwtToken) {
            setCookie('jwt', jwtToken)
        }
        return response.json()}))
    
    console.log('yes')
  return {status, data, error}
}
