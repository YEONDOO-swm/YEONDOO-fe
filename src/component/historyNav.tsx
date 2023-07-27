import { Typography, Box, Card } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../layout/hoverButton.module.css'
import scroll from '../../layout/scroll.module.css'

export const HistoryNav = ({goToHistory, papersInNav, trash} : {goToHistory: any, papersInNav: any, trash: boolean}) => {
    return (
        <Card sx={{ ml: 'auto', mr: '20px', p: '30px 40px', display: 'flex', flexDirection: 'column',borderRadius: '10px', backgroundColor: '#d8e6cd', height: '100%', justifyContent:'space-between'}}>
            <Box sx={{ height: '80vh'}}>
                {/* <Link to="/history" replace style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}> */}
                    <Typography variant="h6" onClick={goToHistory} className={`${styles.customTypography} ${trash? null:styles.currentPage}`} sx={{mb:2}}> 검색결과 </Typography>
                {/* </Link> */}
                <Box sx={{ borderRadius: '15px', backgroundColor: 'white' , height: '55vh'}}>
                <Box>
                    <Typography variant="h6" sx={{textAlign: 'center'}}> 논문보관함 </Typography>
                </Box>
                <Box sx={{overflowY: 'scroll', height: '90%', padding: '10px'}} className={scroll.scrollBar}>                
                    {papersInNav && papersInNav.map((paper: any) => (
                        <Link to={`/paper?paperid=${paper.paperId}`} style={{ textDecoration: 'none', color: 'black' }}>
                            <Typography key={paper.paperId} sx={{textAlign: 'center'}} className={styles.customTypography}>
                                {paper.title}
                            </Typography>
                        </Link>
                    ))}
                </Box>
            </Box>
            </Box>
            <Link to="/history/trash" style={{ textDecoration: 'none', color: 'black' }}>
                <Typography variant="h6" sx={{textAlign: 'center', marginTop: 2}} className={`${styles.customTypography} ${!trash? null:styles.currentPage}`}> 휴지통 </Typography>
            </Link>
        </Card>
    )
}