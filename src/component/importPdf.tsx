import { Box, Typography} from '@mui/material'
import React, { useRef, useState } from 'react';
import CustomButton from './customButton';
import { color } from '../layout/color';
import { postApi, refreshApi } from '../utils/apiUtils';
import { useDispatch, useSelector } from 'react-redux';
import { CounterState, SET_USER_PDF_LIST } from '../reducer';
import { getCookie } from '../cookie';
import { useNotify } from 'react-admin';
import { useNavigate } from 'react-router-dom';

const ImportPdf = ({setIsOpenImportPdf}:{setIsOpenImportPdf: any}) => {
    //화면에 출력되는 파일
    const [selectedImages, setSelectedImages] = useState([]);
    //서버에 보내지는 파일
    const [selectedFiles, setSelectedFiles] = useState(null as any);

    const api: string = useSelector((state: CounterState) => state.api)
    const workspaceId = Number(sessionStorage.getItem("workspaceId"));

    const inputRef = useRef(null)

    const notify = useNotify()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSelectFile = (e: any) => {
        e.preventDefault();
        e.persist();
        //선택한 파일
        const selectedFiles = e.target.files;
        //선택한 파일들을 fileUrlList에 넣어준다. 

        // 업로드되는 파일에는 url이 있어야 한다. filePath로 보내줄 url이다.
        //획득한 Blob URL Address를 브라우져에서 그대로 호출 시에 이미지는 표시가 되고 ,
        //일반 파일의 경우 다운로드를 할 수 있다.
        // for (let i = 0; i < selectedFiles.length; i++) {
        //   const nowUrl = URL.createObjectURL(selectedFiles[i]);
        //   fileUrlList.push(nowUrl[i]);
        // }

        setSelectedFiles(selectedFiles[0]);

        //Array.from() 은 문자열 등 유사 배열(Array-like) 객체나 이터러블한 객체를 배열로 만들어주는 메서드이다.
        const selectedFileArray: any = Array.from(selectedFiles);

        //브라우저 상에 보여질 파일 이름
        const imageArray = selectedFileArray.map((file: any) => {
        return file.name;
        });

        // 첨부파일 삭제시
        setSelectedImages(imageArray);
        e.target.value = '';
    };

    //브라우저상에 보여질 첨부파일
    const attachFile =
        selectedImages &&
        selectedImages.map((image: any) => {
        return (
            <Box key={image}>
                <Box>{image}</Box>
            {/* <button onClick={() => setSelectedImages(selectedImages.filter((e) => e !== image))}>
            삭제
            </button> */}
            </Box>
        );
        });

    const handleClickUpload = () => {

        const formData = new FormData();
        console.log(selectedFiles, selectedFiles.name)
        formData.append('file', selectedFiles)
        formData.append('title', selectedFiles.name)
        fetch(`${api}/api/file/upload?workspaceId=${workspaceId}`,{
            method: 'POST',
            headers : { 'Content-Type' : 'multipart/form-data',
                        'Gauth': getCookie('access') },
            body: formData
        }).then((response) => {
            if (response.status === 401) {
                refreshApi(api, notify, navigate)
            }
            else {
                response.json()
                .then(data => {
                    dispatch({
                        type: SET_USER_PDF_LIST,
                        data: {
                            title: selectedFiles.name.slice(0, -4),
                            paperId: data.paperId,
                            url: data.url,
                        }
                    })
                })

            }
        }).finally(() => {
            setIsOpenImportPdf(false)
        })
    }

 
  return (
    <Box>   
        <Box>
            {/* {selectedImages.length !== 0 && (
            <Box>{attachFile}</Box>
            ) } */}
            {/* {selectedImages.length !== 0 ? (
            ''
            ) : ( */}
            <Box sx={{
                display: 'flex',
            }}>
                <Box sx={{
                    display: 'inline-flex',
                    height: '33px',
                    padding: '0 10px',
                    border: '1px solid #ddd',
                    width: '78%',
                    color: '#999',
                    alignItems: 'center',
                }}>
                    
                    {selectedImages.length === 1 && attachFile}
                    
                </Box>
                <Box onClick={(e)=>{inputRef.current && inputRef.current.click()}}
                    sx={{
                        display: 'inline-flex',
                        padding: '7px 15px',
                        color: color.white,
                        bgcolor: '#999',
                        cursor: 'pointer',
                        height: '20px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        ml: 1
                    }}>
                    <Typography sx={{fontSize: '15px'}}>
                        Find Pdf
                    </Typography>
                </Box>
                <input
                    type='file'
                    name='pdf'
                    onChange={onSelectFile}
                    accept='.pdf'
                    style={{ display: 'none'}}
                    ref={inputRef}
                />
            </Box>
            {/* )} */}
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 10}}>
            <CustomButton title="Upload" width="100px" click={handleClickUpload}/>
        </Box> 

      </Box>
    
  );
}

export default ImportPdf