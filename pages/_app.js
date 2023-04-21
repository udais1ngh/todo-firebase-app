import "@/styles/globals.css";
import Head from "next/head";
import {AuthUserProvider} from "@/firebase/auth";

export default function App({ Component, pageProps }) {
    return (
        <div className="">
            <Head>
                <title> Todo App</title>
            </Head>
            <AuthUserProvider>
            <Component {...pageProps} />
            </AuthUserProvider>
           
        </div>
    );
}
