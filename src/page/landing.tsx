import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {SectionsContainer, Section} from 'react-fullpage'
import React, { useEffect, useState } from 'react'
import MetaTag from '../SEOMetaTag'
import { color } from '../layout/color'
import styled, { keyframes } from 'styled-components';
import styles from '../layout/landing.module.css'
import CustomButton from '../component/customButton'
import logoGreen from '../asset/logoGreen.png'
import logoWhite from '../asset/logoWhite.png'
import logoIcon from '../asset/logoIconGreen.svg'
import macTrans from '../asset/macbookTransparent.png'
import mac from '../asset/macbook.png'
import mainLading from '../asset/mainLanding.png'
import workspaces from '../asset/workspaces.gif'
import exportPng from '../asset/export.png'
import chatLanding from '../asset/chatLading.gif'

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

// Responsive 컴포넌트 속성에 스타일을 추가해서 새로운 컴포넌트 생성

const Wrapper = styled.div`
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between; // 자식 엘리먼트 사이의 여백을 최대로 설정

  .logo {
    font-size: 1.125rem;
    font-weight: 800;
    letter-spacing: 2px;
  }
  .right {
    display: flex;
    align-items: center;
  }
`;

// 헤더가 fixed로 되어있어 페이지의 콘텐츠가 4rem 아래로 나타나도록 해주는 컴포넌트

const Spacer = styled.div`
  height: 4rem;
`;

const Header = () => {
  const navigate = useNavigate()
  return (
    <>
      <HeaderBlock>
        <Wrapper>
          <Box sx={{display: 'flex', alignItems: 'center', ml: 1}}>
            {/* <img src={logoIcon} style={{ transform: 'scaleX(-1)' }} /> */}

            <img src={logoGreen} width="150px"/>
          </Box>
          <div className="right">
            {/* <CustomButton title="Login" width="100px" click={()=>{navigate('/login')}}/> */}
            <Typography sx={{color: color.appbarGreen, mr: 2, fontWeight: 500, cursor: 'pointer'}} onClick={()=>{navigate('/login')}}>
              Login
            </Typography>
          </div>
        </Wrapper>
      </HeaderBlock>
      <Spacer />
    </>
  )
}

const fadeInChat = keyframes`
  0% {
    opacity: 0;
  }
  25% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
`;


const ElementChat = styled.div`
  animation: ${fadeInChat} 5s infinite;
  animation-timing-function: linear;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const fadeInNote = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
`;


const ElementNote = styled.div`
  animation: ${fadeInNote} 5s infinite;
  animation-timing-function: linear;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const fadeInWorkspace = keyframes`
  0% {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
`;


const ElementWorkspace = styled.div`
  animation: ${fadeInWorkspace} 5s infinite;
  animation-timing-function: linear;
  opacity: 0;
  animation-fill-mode: forwards;
`;

export const Landing = () => {
    const navigate = useNavigate()
    const goToLogin = () => {
        navigate(`/login`)
    }

    const completedWord: string = "Yeondoo is your research assistant!"
    const [firstTitle, setFirstTitle] = useState<string>('')
    const [count, setCount] = useState<number>(0)
    const [isTypingCompleted, setIsTypingCompleted] = useState<boolean>(false)

    const isTablet = useMediaQuery("(max-width: 1024px)")
    const isMobile = useMediaQuery("(max-width: 519px)")

    useEffect(()=> {
      //window.scrollTo(0,0)
      
      let typingInterval:NodeJS.Timer|undefined;
      if (count < completedWord.length) {
        typingInterval = setInterval(()=> {
          setFirstTitle((prev) => {
            let result = prev ? prev + completedWord[count] : completedWord[0]
            setCount(count + 1)
            
            if (count === completedWord.length -1) {
              setIsTypingCompleted(true)
            }
            return result
          })
  
          
        }, 70)
      }
      return () => {
        clearInterval(typingInterval)
      }
    }, [count])


    const makeCard = (color: string, text:string, subText: string, image:any, widthStr: string) => (
      <Box sx={{bgcolor: color==='white'?'#fff':'#F2F6F1', height: isTablet?(isMobile?'70vh':'90vh'):'70vh', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexDirection: isTablet?'column-reverse':(color==='white'?'row-reverse':'row')}}>
        <img src={image} style={{width: widthStr, boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)', borderRadius: '0px'}}/>
        {/* {isTablet && <Box height="10px"></Box>} */}
        <Box>
        <Typography sx={{ fontSize: isMobile?'30px':'40px', fontWeight: 700, lineHeight: 1.1, color: '#333', textAlign: isTablet?'center':undefined}}>
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </Typography>
        <Typography sx={{mt: 2, fontSize: isMobile?'12px':'17px', fontWeight: 500, color: '#888', textAlign: isTablet?'center':undefined}}>
          <div dangerouslySetInnerHTML={{ __html: subText }} />
        </Typography>
        </Box>
    </Box>
    )
  return (
    <Box>
        <MetaTag title="Yeondoo" description="Yeondoo is your research assistant! 연두를 통해 특별한 연구 경험을 느껴보세요." keywords="연두, yeondoo, 논문, 논문 내 질의, 질의, gpt, 논문 gpt" />
          <Header/>
            <Box sx={{background: 'linear-gradient(to top, #F2F6F1, #fff)',}}>
              <Box sx ={{height: isMobile?'55vh':'45vh', display: 'flex', flexDirection: 'column',justifyContent: 'flex-end', alignItems: 'center'}}>
                <Box>
                  <Typography sx={{textAlign: 'center', color: color.mainGreen, fontWeight: 700, fontSize: isMobile?'15px':'18px'}}>
                    New study experience
                  </Typography>
                  <Box className={styles.firstTitle} sx={{
                    color: '#333',
                    textAlign: 'center',
                    fontSize: isMobile?'40px':'50px',
                    px: 2,
                    fontWeight: 700}}>
                      {firstTitle ? firstTitle : "Y"}
                  </Box>
                  {isTypingCompleted && <Typography variant= 'h3' className={styles.slideIn} 
                  sx={{fontSize:isMobile?'17px':'22px', fontWeight: '500', textAlign:'center', color: '#888', mt: 2}}>
                      In your own workspace,
                      <br/> try to concentrate on your thesis
                      <br/> by chatting and notting
                  </Typography>}
                  
                </Box>
                <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

                    {isTypingCompleted && <Box className={styles.slideIn} sx={{mt: 4, width: '100px', fontWeight: '500', fontSize: '2vh'}} onClick={goToLogin}>
                        <CustomButton title="START" width="100px" click={null}/>
                    </Box>}
                </Box>
              </Box>
              <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center', pb: 15}}>
                  <img src={mainLading} style={{width: isTablet?'90vw':'65vw',borderTopLeftRadius: '20px', borderTopRightRadius: '20px'}}/>
                  <ElementChat>
                    <Box sx={{position: 'absolute', width: '10vw', top: '80vh', left: '10vw', background: 'linear-gradient(to bottom right, #b89c14, #ffd400)', py: isTablet?'1vw':2, borderRadius: '20px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.4)',
                  display: 'flex', justifyContent: 'center'}}>
                      <Typography sx={{fontSize: isTablet?'3vw':'35px', fontWeight: '700', color: 'white'}}>
                        Chat
                      </Typography>
                    </Box>
                    {/* <Box sx={{position: 'absolute', top: '90vh', left: '19vw'}}>
                      <hr style={{border: 'none', borderTop: '8px dotted #ffd400', height: '1px', width: '10vw',
                                transform: 'rotate(45deg)'}}/>
                    </Box> */}
                  </ElementChat>
                  <ElementNote>
                    <Box sx={{position: 'absolute', width: '10vw', top: isTablet?(isMobile?'90vh':'90vh'):'100vh', left: '80vw', background: 'linear-gradient(to bottom right, #6d14b8, #8b00ff)', py: isTablet?'1vw':2, borderRadius: '20px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.4)',
                  display: 'flex', justifyContent: 'center'}}>
                      <Typography sx={{fontSize: isTablet?'3vw':'35px', fontWeight: '700', color: 'white'}}>
                        Note
                      </Typography>
                    </Box>
                    {/* <Box sx={{position: 'absolute', top: '110vh', left: '70vw'}}>
                      <hr style={{border: 'none', borderTop: '8px dotted #6d14b8', height: '1px', width: '10vw',
                                transform: 'rotate(20deg)'}}/>
                    </Box> */}
                  </ElementNote>
                  <ElementWorkspace>
                    <Box sx={{position: 'absolute', width: '19vw', top: isMobile?'70vh':'60vh', left: '75vw', background: 'linear-gradient(to bottom right, #0d4f75, #0067a3)', py: isTablet?'1vw':2, borderRadius: '20px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.4)',
                  display: 'flex', justifyContent: 'center'}}>
                      <Typography sx={{fontSize: isTablet?'3vw':'35px', fontWeight: '700', color: 'white'}}>
                        Workspace
                      </Typography>
                    </Box>
                    {/* <Box sx={{position: 'absolute', top: '68vh', left: '65.5vw'}}>
                      <hr style={{border: 'none', borderTop: '8px dotted #0067a3', height: '1px', width: '10vw',
                                transform: 'rotate(35deg)'}}/>
                    </Box> */}
                  </ElementWorkspace>
              </Box>
            </Box>
            {makeCard('green', 'Create your <br/> own workspace', 'Manage your study by workspace!', workspaces, isTablet?'80vw':'50vw')}
            {makeCard('white', "Is there any part <br/> you don't understand? <br/> Want to see summary?", 'Ask any questions you have through chat. <br/> You can receive highly accurate answers.', chatLanding, isTablet?'40vw':'20vw')}
            <Box sx={{bgcolor: '#F2F6F1', height: isTablet?(isMobile?'70vh':'90vh'):'70vh', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexDirection: isTablet?'column-reverse':'row'}}>
              <img src={exportPng} style={{width: isTablet?'80vw':'50vw'}}/>
              <Box>
              <Typography sx={{ fontSize: isMobile?'30px':'40px', fontWeight: 700, lineHeight: 1.1, color: '#333', textAlign: isTablet?'center':undefined}}>
                Convert the records <br/> you left <br/> into various types
              </Typography>
              <Typography sx={{mt: 2, fontSize: isMobile?'12px':'17px', fontWeight: 500, color: '#888', textAlign: isTablet?'center':undefined}}>
                  The Generate Summary function summarizes your records <br/> with the purpose and format you want.
              </Typography>
              </Box>
          </Box>
          <Box sx={{height: '20vh', px: 3, bgcolor: color.mainGreen, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: color.white}}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <img src={logoWhite} style={{width: '120px'}}/>
              <Box sx={{ml: 1}}>
                <Typography sx={{fontSize: isMobile?'12px':'15px'}}>
                  서울특별시 강남구 테헤란로 311(역삼동) 아남타워빌딩 7층(06151)
                  <br/>
                  기업 또는 이용 문의: igy2840@gmail.com
                </Typography>
              </Box>
            </Box>
            <Typography sx={{fontSize: isMobile?'12px':'15px', fontWeight: 600, cursor: 'pointer'}} onClick={() => {navigate('/personalInfo')}}>
              개인정보처리방침
            </Typography>
        </Box>
        <Box sx={{height: '6vh', bgcolor: color.mainGreen, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', color: color.white}}>
          <Typography sx={{textAlign: 'center', fontSize: isMobile?'12px':'15px'}}>
            COPYRIGHT 2023 Federation Co. All RIGHTS RESERVED.
          </Typography>
        </Box>
    </Box>
  )
  }