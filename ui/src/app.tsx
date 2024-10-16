// @refresh reload
import { Suspense } from "solid-js";
import { FileRoutes } from "@solidjs/start/router";
import { A, Router } from "@solidjs/router";
import { isServer } from "solid-js/web";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { getCookie } from "vinxi/http";
import "./app.css";
import { MetaProvider, Title } from "@solidjs/meta";
import { AppBar } from "./components/ui/appbar";
import {
  NavigationMenu,
  NavigationMenuTrigger,
} from "./components/ui/navigation-menu";
import { NavBar } from "./components/ui/navbar";

function getServerCookies() {
  "use server";
  const colorMode = getCookie("kb-color-mode");
  return colorMode ? `kb-color-mode=${colorMode}` : "";
}

export default function App() {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : document.cookie,
  );

  return (
    <>
      {/* <ColorModeScript storageType={storageManager.type}/>
      <ColorModeProvider storageManager={storageManager} initialColorMode="light"> */}
        <MetaProvider>
          <Title>Open Farm Carbon Tracker</Title>

          <Router
            root={(props) => (
              <>
                <div class="flex flex-col w-screen h-screen overflow-hidden">
                  <AppBar />
                  <NavBar />

                  
                    <Suspense>
                      {props.children}
                    </Suspense>
                  
                </div>
              </>
            )}
          >
            <FileRoutes />
          </Router>
        </MetaProvider>
      {/* </ColorModeProvider> */}
    </>
  );
}
