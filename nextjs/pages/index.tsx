import Head from 'next/head';
import { Header }  from "../components/Header";
import { Footer }  from "../components/Footer";

export default function Home() {
    return (
        <>
            <Head>
                <title>{process.env.APP_NAME}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main>
                {/* !!!!!!!!!!!!!CONTENT!!!!!!!!!!! */}
                <h1>
                    Welcome to <a href="https://nextjs.org">Next.js!</a>
                </h1>
                
            </main>

            <Footer/>
            
        </>
    )
}