// @refresh reload
import { Suspense } from "solid-js";
import { FileRoutes } from "@solidjs/start/router";
import { Router } from "@solidjs/router";

import "./styling/reset.css";
import "./styling/root.css";
import { MetaProvider, Title } from "@solidjs/meta";

export default function App() {
  return (
    <>
      <MetaProvider>
        <Title>Open Farm Carbon Tracker</Title>

        <div class="appbar">
          <h1>Open Farm Carbon Tracker</h1>
          <div>
            <a href="https://github.com/euraf/OpenFarmCarbonTracker">
              <img width="25" src="/github-mark/github-mark-white.png" />
            </a>
          </div>
        </div>

        <Router
          root={(props) => (
            <Suspense>
              {props.children}
            </Suspense>
          )}
        >
          <FileRoutes />
        </Router>
      </MetaProvider>
    </>
  );
}
