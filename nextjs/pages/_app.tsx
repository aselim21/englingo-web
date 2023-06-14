import "../styles/globals.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../utils/theme";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}