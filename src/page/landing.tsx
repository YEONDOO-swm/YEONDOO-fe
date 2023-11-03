import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {SectionsContainer, Section} from 'react-fullpage'
import React, { useEffect, useState } from 'react'
import MetaTag from '../SEOMetaTag'
import { color } from '../layout/color'
import styled, { keyframes } from 'styled-components';
import styles from '../layout/landing.module.css'
import CustomButton from '../component/customButton'
import logoGreen from '../asset/logoGreen.png'
import logoIcon from '../asset/logoIconGreen.svg'
import macTrans from '../asset/macbookTransparent.png'
import mac from '../asset/macbook.png'

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
            <Typography sx={{color: color.appbarGreen, mr: 2, fontWeight: 500, cursor: 'pointer'}}>
              Login
            </Typography>
          </div>
        </Wrapper>
      </HeaderBlock>
      <Spacer />
    </>
  )
}


export const Landing = () => {
    const navigate = useNavigate()
    const goToLogin = () => {
        navigate(`/login`)
    }

    const completedWord: string = "Yeondoo is your research assistant!"
    const [firstTitle, setFirstTitle] = useState<string>('')
    const [count, setCount] = useState<number>(0)
    const [isTypingCompleted, setIsTypingCompleted] = useState<boolean>(false)

    useEffect(()=> {
      window.scrollTo(0,0)
      if (window.location.pathname !== '#first') {
        window.location.href = '#first'
      }
      
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

    let options = {
      anchors: ['first', 'second', 'third']
    }
  return (
    <Box>
        <MetaTag title="Yeondoo" description="연두를 통해 특별한 연구 경험을 느껴보세요." keywords="연두, yeondoo, 논문, 논문 내 질의, 질의, gpt, 논문 gpt" />
        
        {/* <SectionsContainer {...options}>
          <Section> */}
          <Header/>
            <Box sx ={{height: '95vh', display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center', bgcolor: color.white}}>
              <Box>
                <Typography sx={{textAlign: 'center', color: color.mainGreen, fontWeight: 700, fontSize: '18px'}}>
                  New study experience
                </Typography>
                <Box className={styles.firstTitle} sx={{
                  color: '#333',
                  textAlign: 'center',
                  fontSize: '50px',
                  fontWeight: 700}}>
                    {firstTitle ? firstTitle : "Y"}
                </Box>
                {isTypingCompleted && <Typography variant= 'h3' className={styles.slideIn} 
                sx={{fontSize:'22px', fontWeight: '500', textAlign:'center', color: '#888', mt: 2}}>
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
              {/* <Box>
                  <img src={mac} style={{borderLeft: '1px solid #ddd'}}/>
              </Box> */}
            </Box>
          {/* </Section>
          <Section> */}
            <Box sx={{height: '100vh', bgcolor: color.appbarGreen, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <Box sx={{height: '50vh', display: 'flex', alignItems: 'center'}}>
                <Box sx={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>

                  <img src='../images/home.png' width="40%" className={styles.images}/>
                  <Box className={styles.texts} sx={{height: '300', diplay: 'flex', flexDirection:'column', justifyContent: 'center', margin: 'auto 0'}}>
                    Search papers you want
                  </Box>
                </Box>
              </Box>

              <Box sx={{height: '50vh', display: 'flex', alignItems: 'center'}}>
                <Box sx={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>
                  <Box className={styles.texts} sx={{height: '300', diplay: 'flex', flexDirection:'column', justifyContent: 'center', margin: 'auto 0'}}>
                    Keep your favorite papers
                  </Box>
                  <img src='../images/storage.png' width="40%" className={styles.images}/>
                </Box>
              </Box>
            </Box>
          {/* </Section>
          <Section> */}
          <Box sx={{height: '100vh', bgcolor: color.appbarGreen}}>
            <Box sx={{display: 'flex', mx: 10, alignItems: 'center', height: '100vh'}}>
              <Box sx={{mt: 8, my: 5, display: 'flex', justifyContent: 'space-around', width: '100%'}}>
                <img src='../images/chat.png' width="50%" className={styles.images} />
                <Box className={styles.texts} sx={{height: '300', diplay: 'flex', flexDirection:'column', justifyContent: 'center', margin: 'auto 0'}}>
                  Ask any questions <br/>you have <br/>about the paper
                </Box>
              </Box>
            </Box>
          </Box>
          {/* </Section>
        </SectionsContainer> */}
    </Box>
  )
  }