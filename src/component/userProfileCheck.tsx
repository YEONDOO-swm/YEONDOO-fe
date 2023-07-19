import * as React from "react";
import { useNavigate } from 'react-router-dom';

export const UserProfileCheck = () => {
    const navigate = useNavigate()

    if (localStorage.getItem('isFirst')==='true'){
      navigate('/userprofile')
    }
}