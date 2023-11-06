import { IconButton } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import * as amplitude from '@amplitude/analytics-browser';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from "react";
import * as Sentry from '@sentry/react';
import { getCookie, setCookie } from "../cookie";
import { useSelector } from "react-redux";
import { CounterState } from "../reducer";
import { paperType } from "../page/home";
import { useNavigate } from "react-router-dom";
import { useNotify } from "react-admin";
import { postApi, refreshApi } from "../utils/apiUtils";
import { color } from "../layout/color";

type onUpdateLikesType = (
  paperId: string,
  newLikes: number
 ) => void

export const HeartClick = ({ currentItem, onUpdateLikes, paperlike}: { currentItem: paperType, onUpdateLikes?:onUpdateLikesType, paperlike?: boolean }) => {
    const [paperIdArray, setPaperIdArray] = useState<string[]>([]);
    const [isPaperLike, setIsPaperLike] = useState<boolean|undefined>(paperlike)

    const api: string = useSelector((state: CounterState) => state.api)

    const workspaceId = Number(sessionStorage.getItem("workspaceId"));

    const navigate = useNavigate()
    const notify = useNotify()
    
    const handleHeartClick = (paperId:string) => {
        var payload
        if (paperIdArray.includes(paperId) || isPaperLike) {
          if (process.env.NODE_ENV === 'production') {
            amplitude.track("찜 버튼 취소",{paperId: paperId})
          }
          setIsPaperLike(false)
          for (var i = 0; i<paperIdArray.length; i++){
            if (paperIdArray[i] === paperId) {
              paperIdArray.splice(i, 1);
              break;
            }
          }
          setPaperIdArray(paperIdArray)
          payload = {
            workspaceId: Number(sessionStorage.getItem('workspaceId')),
            paperId: paperId,
            on: false
          }
          if (onUpdateLikes){

            onUpdateLikes(currentItem.paperId, currentItem.likes - 1)
          }
        }
        else {
          if (process.env.NODE_ENV === 'production') {
            amplitude.track("찜 버튼 Clicked", {paperId: paperId})
          }
          setPaperIdArray(prevArray => [...prevArray, paperId]);
          payload = {
            workspaceId: Number(sessionStorage.getItem('workspaceId')),
            paperId: paperId,
            on: true
          }
          if (onUpdateLikes){

            onUpdateLikes(currentItem.paperId, currentItem.likes + 1);
          }
        }
        postApi(api, `/api/paperlikeonoff`, payload)
        .then(response => {
          if (response.status === 401) {
            refreshApi(api, notify, navigate)
          } else if (response.status === 400) {
            navigate(`/home`)
          }
          return response;
          }
        )
        .catch(error => {
          console.error("찜 버튼 에러: ", error)
          Sentry.captureException(error)
        })
      }
    
    return (
        <IconButton onClick={() => handleHeartClick(currentItem.paperId)}>
            {   paperIdArray.includes(currentItem.paperId) || isPaperLike ? (
                <FavoriteIcon sx={{margin: '0', color: color.mainGreen}} />
                ) : (
                <FavoriteBorderIcon sx={{color: color.mainGreen}}/>
                )
            }
        </IconButton>
    )
}