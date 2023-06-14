import {createTheme} from "@mui/material/styles";
import { typography } from "@mui/system";
import { Comforter, Roboto } from "next/font/google";
import { blue, pink, red, yellow, green } from "@mui/material/colors";

export const comforter = Comforter({
  weight: ['400'],
  // fallback: [],
  subsets: ['latin'],
  // style: ['normal']
})
export const roboto = Roboto({
  weight: ['400'],
  // fallback: [],
  subsets: ['latin'],
  style: ['normal']
})

const theme = createTheme({
  palette: {
    primary: {
      main: "#543454",
      ligh: "#E7DBE7",
      dark: "#302440",
      contrastText: "#4D4D4D" 
    },
    secondary: {
      main: "#A1A074",
      ligh: "#EDECAB",
      dark: "#616046",
      contrastText: "" 
    },
    text: {
      primary: "#000000",
      secondary: "#FFFFFF"
    },
    error: red,
    warning: yellow,
    success: green
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    logo: {
      fontFamily: comforter.style.fontFamily,
      fontSize: '5rem',
    },
  }
})

export default theme;