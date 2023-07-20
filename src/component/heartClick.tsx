import { IconButton } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState } from "react";

export const HeartClick = ({ currentItem, home, onUpdateLikes, callGetApi}: { currentItem: any, home: boolean, onUpdateLikes?:any, callGetApi?: any }) => {
    const [paperIdArray, setPaperIdArray] = useState<string[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);

    var api = '';
    if (process.env.NODE_ENV === 'development'){
      api = `${import.meta.env.VITE_REACT_APP_LOCAL_SERVER}`
    }
    else if (process.env.NODE_ENV === 'production'){
      api = `${process.env.VITE_REACT_APP_AWS_SERVER}`
    }
    
    const handleHeartClick = (paperId:any) => {
        var payload
        if (paperIdArray.includes(paperId)) {
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
            onoff: false
          }
        }
        else {
          if (!home){
            const isConfirmed = window.confirm(`정말 "${currentItem.title}"을 논문보관함에서 삭제하시겠습니까?`)
            if (!isConfirmed) {
              return
            }
          }
          setPaperIdArray(prevArray => [...prevArray, paperId]);
          payload = {
            username: sessionStorage.getItem('username'),
            paperId: paperId,
            onoff: true
          }
        }
        setIsFavorite(!isFavorite);

        if (home) {
          const newLikes = isFavorite ? currentItem.likes - 1 : currentItem.likes + 1;
          onUpdateLikes(currentItem.paperId, newLikes);
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

        if (!home) {
          callGetApi()
        }
      }
    
    return (
        <IconButton onClick={() => handleHeartClick(currentItem.paperId)}>
            {   home ?
                (paperIdArray.includes(currentItem.paperId) ? (
                <FavoriteIcon sx={{margin: '0'}} color="error"/>
                ) : (
                <FavoriteBorderIcon />
                ))
                :
                (paperIdArray.includes(currentItem.paperId) ? (
                    <FavoriteBorderIcon />
                    ) : (
                    <FavoriteIcon sx={{margin: '0'}} color="error"/>
                    ))
            }
        </IconButton>
    )
}