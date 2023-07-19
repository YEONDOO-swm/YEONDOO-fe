import { IconButton } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState } from "react";

export const HeartClick = ({ currentItem, home }: { currentItem: any, home: boolean }) => {
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
          setPaperIdArray(prevArray => [...prevArray, paperId]);
          payload = {
            username: sessionStorage.getItem('username'),
            paperId: paperId,
            onoff: true
          }
        }
        setIsFavorite(!isFavorite);
    
        fetch(`${api}/api/paperlikeonoff`, {
          method: 'POST',
          headers: { 'Content-Type' : 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('찜 버튼 에러')
          }
        })
    
      }
    
    return (
        <IconButton onClick={() => handleHeartClick(currentItem)}>
            {   home ?
                (paperIdArray.includes(currentItem) ? (
                <FavoriteIcon sx={{margin: '0'}} color="error"/>
                ) : (
                <FavoriteBorderIcon />
                ))
                :
                (paperIdArray.includes(currentItem) ? (
                    <FavoriteBorderIcon />
                    ) : (
                    <FavoriteIcon sx={{margin: '0'}} color="error"/>
                    ))
            }
        </IconButton>
    )
}