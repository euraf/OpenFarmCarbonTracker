import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => {
  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="en">
					<head>
						<meta charset="utf-8" />
						<meta
							name="viewport"
							content="width=device-width, initial-scale=1"
						/>
						<link rel="icon" href="/favicon.ico" />

						<title>OpenFarmCarbokTracker</title>
						<meta charset="utf-8" />
						<meta
							name="viewport"
							content="width=device-width, initial-scale=1"
						/>

						<link
							rel="shortcut icon"
							type="image/png"
							href="/images/icon.png"
						/>


						{/* <!-- Set Charset to UTF-8 --> */}
						<meta charset="UTF-8" />

						<meta
							name="viewport"
							content="width=device-width, initial-scale=1"
						/>

						{assets}
					</head>
          <body class="overflow-hidden">
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      )}
    />
  );
});
