// @refresh reload
import { Suspense } from "solid-js";
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./styling/reset.css";
import "./styling/root.css";
import "./styling/button.css";
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@suid/material"



export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
      <Title>OpenFarmCarbonCalculator</Title>
      {/* <Box sx={{ flexGrow: 1 }}> */}

    <AppBar position="static">
      <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/* <MenuIcon /> */}
          {/* </IconButton> */} 
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OpenFarmCarbonCalculator
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
        </AppBar>
        {/* </Box> */}



        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
