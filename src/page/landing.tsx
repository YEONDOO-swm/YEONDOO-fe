import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {SectionsContainer, Section} from 'react-fullpage'
import React, { useEffect, useState } from 'react'
import MetaTag from '../SEOMetaTag'
import { color } from '../layout/color'
import styled, { keyframes } from 'styled-components';
import styles from '../layout/landing.module.css'


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
        
        <SectionsContainer {...options}>
          <Section>
            <Box sx ={{height: '100vh', display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center', bgcolor: color.mainGreen}}>
            <Box>

            
            <Box className={styles.firstTitle} sx={{
              color: color.appbarGreen,
              textAlign: 'center'}}>
                {firstTitle ? firstTitle : "Y"}
            </Box>
            {isTypingCompleted && <Typography variant= 'h3' className={styles.slideIn} sx={{fontSize:'5vh', fontWeight: '500', textAlign:'center'}}>
                Experience efficient research with Yeondoo
            </Typography>}
            
            </Box>
            <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

                {isTypingCompleted && <Button variant='contained' className={styles.slideIn} sx={{mt: 4, width: '100px', fontWeight: '500', fontSize: '2vh'}} onClick={goToLogin}>
                    Start
                </Button>}
            </Box>
        </Box>
          </Section>
          <Section>
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
          </Section>
          <Section>
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
          </Section>
        </SectionsContainer>
    </Box>
  )
  }