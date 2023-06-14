import Head from 'next/head';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Welcome } from "../components/Welcome";
import theme from "../utils/theme";
import { ThemeProvider, CssBaseline } from "@mui/material";

export default function Home() {
    return (
        <>
            <Head>
                <title>{process.env.APP_NAME}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                <Header />

                <main>


                    <Welcome />


                </main>

                <Footer />
            </ThemeProvider>

        </>
    )
}