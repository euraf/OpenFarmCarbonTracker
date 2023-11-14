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

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Title>Open Farm Carbon Tracker</Title>
        {/* <Box sx={{ flexGrow: 1 }}> */}

        <div class="appbar" >
          <h1>Open Farm Carbon Tracker</h1>
          <div><a href="https://github.com/euraf/OpenFarmCarbonTracker"><img width="25" src="/github-mark/github-mark-white.png" /></a></div>
        </div>
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
