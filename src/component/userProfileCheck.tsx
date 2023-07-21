import * as React from "react";
import { useNavigate } from 'react-router-dom';
import { useNotify } from "react-admin";
import { useEffect } from "react";

export const UserProfileCheck = () => {
    const navigate = useNavigate()
    const notify = useNotify()

    useEffect(()=> {
      if (localStorage.getItem('isFirst')==='true'){
        notify('유저 프로필 등록 후 이용 가능합니다.')
        navigate('/userprofile')
      }
    },[])
}