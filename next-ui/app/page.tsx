import Image from 'next/image'
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PredictEnergy from '@/components/PredictEnergy';
import MyEditor from '@/components/editor/App';
import { Container } from '@mui/material';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import MyEditor from "../components/editor/App";
// import PredictEnergy from "../components/PredictEnergy";


export default function Home() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
      
      <div>
          <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
          <Container maxWidth="lg">
            {/* <Toolbar> */}
            <br />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                OpenFarmCarbonTracker
              </Typography>
              <br />
            {/* </Toolbar> */}
            </Container>
          </AppBar>
        </Box>

        < br />< br />
        <Container maxWidth="lg">

          <Typography variant="h5" gutterBottom={true} >Energy usage</Typography>
            
          <MyEditor />
          <br />
          <PredictEnergy />
          
          <Typography variant="h5" gutterBottom={true} >Carbon Stock</Typography>
        </Container>
        
      </div>
    // </main>
  )
}
