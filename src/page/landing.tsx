// import { Box, Button, Typography } from '@mui/material'
// import { useNavigate } from 'react-router-dom'
// import React, { useEffect, useState } from 'react'
// import MetaTag from '../SEOMetaTag'
// import styles from '../layout/landing.module.css'
// import 'https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js';
// import './scroll-timeline.js'
// import { Animated } from 'react-web-animation'


// export const Landing = () => {
//     const navigate = useNavigate()
//     const [direction, setDirection] = useState('down'); // Initialize direction state
//     const goToLogin = () => {
//         navigate(`/login`)
//     }

//     const airplane = document.querySelector('.airplane');
//         const airplaneScrollTimeline = document.querySelector('.airplane_scroll_timeline');
//         const prevScrollY = { current: -1 };

//     const getKeyFrames =() => {
//         return [
//             { offsetDistance: '100%', offset: 0 },
//             { offsetDistance: '47%', offset: 0.4 },
//             { offsetDistance: '47%', offset: 0.58 },
//             { offsetDistance: '0%', offset: 1 },
//         ];
//     }
 
//     const getTiming = ( duration:any ) => {
//         return {
//             fill: 'both',
//             timeline: new ScrollTimeline({
//               scrollOffsets: [
//                 { target: airplaneScrollTimeline, edge: 'start', threshold: 1 },
//                 { target: airplaneScrollTimeline, edge: 'end', threshold: 1 },
//               ],
//             }),
//         };
//     }

//   return (
//     // <Box sx={{width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
//     //     <MetaTag title="연두" description="연두를 통해 특별한 연구 경험을 느껴보세요." keywords="연두, yeondoo, 논문, 논문 내 질의, 질의, gpt, 논문 gpt" />
//     //     <Box>
//     //         <Typography variant='h2'>
//     //             연두를 통해
//     //         </Typography>
//     //         <Typography variant= 'h3'>
//     //             색다른 연구를 경험해보세요.
//     //         </Typography>
//     //         <Box sx={{width: '100%'}}>

//     //             <Button variant='outlined' sx={{mt: 2, display: 'flex', flexDirection: 'row-reverse'}} onClick={goToLogin}>
//     //                 Login
//     //             </Button>
//     //         </Box>
//     //     </Box>
        
//     // </Box>
//     <>
//   <meta charSet="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>WAAPI</title>
//   <link rel="preconnect" href="https://fonts.googleapis.com" />
//   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
//   <link
//     href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
//     rel="stylesheet"
//   />
//   <link rel="stylesheet" href="./main.css" />
//   <div className={styles.wrap}>
//     <header className={styles.header}>
//       <h1 className={styles.main_copy}>Enjoy Your Flight!</h1>
//       <p>
//         <a href="https://github.com/flackr/scroll-timeline">
//           scroll-timeline.js
//         </a>
//         Lorem ipsum dolor,
//         <br />
//         sit amet consectetur adipisicing elit.
//         <br />
//         Repellat hic excepturi
//         <br />
//         asperiores blanditiis explicabo
//         <br />
//         tenetur modi consectetur animi
//         <br />
//         reiciendis maxime!
//       </p>
//     </header>
//     <div className={`${styles.airstrip} ${styles.airstrip_a}`} />
//     <div className={`${styles.airstrip} ${styles.airstrip_b}`} />
//     <section className={styles.gallery_timeline}>
//       {/* 제주도 */}
//       <figure className={styles.jeju}>
//         <img src="../../images/jeju.svg" alt="제주도" />
//       </figure>
//       {/* 갤러리 */}
//       <div className={styles.gallery}>
//         <div className={styles.gallery_item}>
//           <figure className={styles.gallery_photo}>
//             <img src="../../images/photo/photo01.jpg" alt="" />
//           </figure>
//         </div>
//         <div className={styles.gallery_item}>
//           <figure className={styles.gallery_photo}>
//             <img src="../../images/photo/photo02.jpg" alt="" />
//           </figure>
//         </div>
//         <div className={styles.gallery_item}>
//           <figure className={styles.gallery_photo}>
//             <img src="../../images/photo/photo03.jpg" alt="" />
//           </figure>
//         </div>
//         <div className={styles.gallery_item}>
//           <figure className={styles.gallery_photo}>
//             <img src="../../images/photo/photo04.jpg" alt="" />
//           </figure>
//         </div>
//         <div className={styles.gallery_item}>
//           <figure className={styles.gallery_photo}>
//             <img src="../../images/photo/photo05.jpg" alt="" />
//           </figure>
//         </div>
//       </div>
//     </section>
//     <section className={styles.airplane_scroll_timeline}>
//       <div className={`${styles.track}`}>
//         <Animated.div keyframes={getKeyFrames()}
//         timing={getTiming(3000)}>
//             <img className={styles.airplane} src="../../images/airplane.svg" alt=""/>
//         </Animated.div>
//         <svg
//           className="flight-path-svg"
//           viewBox="0 0 1047.79 4304.71"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             className={styles.flight_path}
//             d="m523.89,4304.71v-102.65c0-380.2-349.01-699.56-349.01-699.56-444.83-376.4,250.93-486.65,250.93-486.65,444.83-102.65,557.68-250.93,557.68-250.93,283.93-319.37-486.96-646.34-486.96-646.34-258.91-112.16-314.04-296.55-314.04-296.55C-5.24,1295.45,395.39,1206.1,502.03,1255.07c65,29.84,105.64,109.85,90,179.91-35.06,157.03-234.66,151.32-234.66,151.32-287.05,0-340.67-193.9-340.67-193.9-85.15-285.15,215.21-534.18,215.21-534.18,309.81-245.7,291.98-636.53,291.98-636.53V0"
//           />
//           <g className={styles.hello_jeju}>
//             <path
//               className="cls-2"
//               d="m239.51,1492.31l-11.33,2.83-4.93-19.74-16.79,4.2,4.93,19.74-11.4,2.85-11.82-47.28,11.4-2.85,4.69,18.77,16.79-4.2-4.69-18.77,11.33-2.83,11.82,47.28Z"
//             />
//             <path
//               className="cls-2"
//               d="m271.02,1463.11l-17.92,4.48,2.82,11.3,21.17-5.29,2.19,8.77-32.57,8.14-11.82-47.28,32.63-8.16,2.2,8.8-21.24,5.31,2.49,9.97,17.92-4.48,2.11,8.44Z"
//             />
//             <path
//               className="cls-2"
//               d="m293.14,1469.59l19.84-4.96,2.19,8.77-31.24,7.81-11.82-47.28,11.4-2.85,9.63,38.51Z"
//             />
//             <path
//               className="cls-2"
//               d="m329.18,1460.58l19.84-4.96,2.19,8.77-31.24,7.81-11.82-47.28,11.4-2.85,9.63,38.51Z"
//             />
//             <path
//               className="cls-2"
//               d="m388.31,1431.03c1.15,4.61,1.32,8.91.49,12.88-.82,3.98-2.57,7.32-5.24,10.02s-6.02,4.56-10.05,5.56-7.83.97-11.41-.1-6.67-3.11-9.27-6.12c-2.6-3.01-4.51-6.73-5.71-11.17l-.67-2.66c-1.16-4.63-1.33-8.93-.52-12.89.81-3.96,2.57-7.31,5.26-10.02,2.69-2.72,6.06-4.58,10.11-5.6s7.81-.94,11.43.18c3.61,1.12,6.73,3.22,9.36,6.3,2.62,3.08,4.51,6.89,5.67,11.43l.54,2.18Zm-12.09.92c-1.17-4.7-2.85-8.07-5.03-10.11-2.18-2.04-4.73-2.7-7.65-1.97-5.71,1.43-7.66,6.47-5.85,15.12l.84,3.48c1.16,4.63,2.82,8,4.98,10.11,2.16,2.11,4.75,2.78,7.78,2.02s4.79-2.5,5.74-5.33c.95-2.84.86-6.55-.27-11.15l-.54-2.18Z"
//             />
//             <path
//               className="cls-2"
//               d="m423.43,1396.1l11.36-2.84,8.11,32.44c.75,3.01.73,5.87-.08,8.58-.81,2.71-2.3,5.02-4.47,6.95s-4.8,3.27-7.87,4.04c-5.15,1.29-9.48.99-12.99-.89s-5.86-5.21-7.05-9.97l11.43-2.86c.54,2.16,1.31,3.64,2.3,4.43s2.36.96,4.12.52c1.58-.39,2.65-1.29,3.21-2.68.56-1.39.58-3.15.04-5.27l-8.11-32.44Z"
//             />
//             <path
//               className="cls-2"
//               d="m478.09,1411.35l-17.92,4.48,2.82,11.3,21.17-5.29,2.19,8.77-32.57,8.14-11.82-47.28,32.63-8.16,2.2,8.8-21.24,5.31,2.49,9.97,17.92-4.48,2.11,8.44Z"
//             />
//             <path
//               className="cls-2"
//               d="m498.01,1377.46l11.36-2.84,8.11,32.44c.75,3.01.73,5.87-.08,8.58-.81,2.71-2.3,5.02-4.47,6.95s-4.8,3.27-7.87,4.04c-5.15,1.29-9.48.99-12.99-.89s-5.86-5.21-7.05-9.97l11.43-2.86c.54,2.16,1.31,3.64,2.3,4.43s2.36.96,4.12.52c1.58-.39,2.65-1.29,3.21-2.68.56-1.39.58-3.15.04-5.27l-8.11-32.44Z"
//             />
//             <path
//               className="cls-2"
//               d="m553.63,1363.56l7.74,30.94c.88,3.51.89,6.73.04,9.67s-2.51,5.43-4.96,7.47c-2.46,2.04-5.59,3.54-9.4,4.49-5.76,1.44-10.67,1.08-14.73-1.08s-6.77-5.83-8.13-11.01l-7.79-31.17,11.46-2.87,7.85,31.4c1.42,5.14,4.47,7.13,9.15,5.96,2.36-.59,3.98-1.69,4.87-3.29.89-1.6.97-3.86.24-6.79l-7.72-30.88,11.4-2.85Z"
//             />
//           </g>
//         </svg>
//       </div>
//     </section>
//     <section className={styles.page_content}>
//       <div className={styles.text_block} style={{ right: "10%", top: "25%" }}>
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Id aspernatur
//         explicabo doloremque ex earum deleniti itaque repellendus labore placeat
//         laboriosam?
//       </div>
//       <div className={styles.text_block} style={{ right: "20%", top: "80%" }}>
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Id aspernatur
//         explicabo doloremque ex earum deleniti itaque repellendus labore placeat
//         laboriosam?
//       </div>
//       <div className={styles.text_block} style={{ left: 0, top: "90%", width: "30%" }}>
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Id aspernatur
//         explicabo doloremque ex earum deleniti itaque repellendus labore placeat
//         laboriosam?
//       </div>
//       <div
//         className={styles.text_block}
//         style={{ left: 0, top: "98%", width: "100%", textAlign: "center" }}
//       >
//         Bye Bye
//       </div>
//     </section>
//   </div>
// </>

//   )
//   }

import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import MetaTag from '../SEOMetaTag'


export const Landing = () => {
    const navigate = useNavigate()
    const goToLogin = () => {
        navigate(`/login`)
    }
  return (
    <Box sx={{width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <MetaTag title="연두" description="연두를 통해 특별한 연구 경험을 느껴보세요." keywords="연두, yeondoo, 논문, 논문 내 질의, 질의, gpt, 논문 gpt" />
        <Box>
            <Typography variant='h2'>
                연두를 통해
            </Typography>
            <Typography variant= 'h3'>
                색다른 연구를 경험해보세요.
            </Typography>
            <Box sx={{width: '100%'}}>

                <Button variant='outlined' sx={{mt: 2, display: 'flex', flexDirection: 'row-reverse'}} onClick={goToLogin}>
                    Login
                </Button>
            </Box>
        </Box>
        
    </Box>
  )
  }