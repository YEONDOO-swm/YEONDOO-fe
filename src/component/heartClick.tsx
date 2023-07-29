import { IconButton } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import * as amplitude from '@amplitude/analytics-browser';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from "react";

export const HeartClick = ({ currentItem, onUpdateLikes, paperlike}: { currentItem: any, onUpdateLikes?:any, paperlike?: any }) => {
    const [paperIdArray, setPaperIdArray] = useState<string[]>([]);
    const [isPaperLike, setIsPaperLike] = useState(paperlike)

    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }
    
    const handleHeartClick = (paperId:any) => {
        var payload
        if (paperIdArray.includes(paperId) || isPaperLike) {
          amplitude.track("찜 버튼 취소",{paperId: paperId})
          setIsPaperLike(false)
          for (var i = 0; i<paperIdArray.length; i++){
            if (paperIdArray[i] === paperId) {
              paperIdArray.splice(i, 1);
              break;
            }
          }
          setPaperIdArray(paperIdArray)
          payload = {
            username: sessionStorage.getItem('username'),
            paperId: paperId,
            on: false
          }
          onUpdateLikes(currentItem.paperId, currentItem.likes - 1)
        }
        else {
          amplitude.track("찜 버튼 Clicked", {paperId: paperId})
          setPaperIdArray(prevArray => [...prevArray, paperId]);
          payload = {
            username: sessionStorage.getItem('username'),
            paperId: paperId,
            on: true
          }
          onUpdateLikes(currentItem.paperId, currentItem.likes + 1);
        }
   
        fetch(`${api}/api/paperlikeonoff`, {
          method: 'POST',
          headers: { 'Content-Type' : 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(response => {
          return response;
          }
        )
        .catch(error => {
          console.error("찜 버튼 에러: ", error)
        })
      }
    
    return (
        <IconButton onClick={() => handleHeartClick(currentItem.paperId)}>
            {   paperIdArray.includes(currentItem.paperId) || isPaperLike ? (
                <FavoriteIcon sx={{margin: '0'}} color="error"/>
                ) : (
                <FavoriteBorderIcon />
                )
            }
        </IconButton>
    )
}