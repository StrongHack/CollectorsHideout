import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Providers from "./providers";
import MyNavbar from "../../components/navbar";
import { SiteFooter } from "../../components/footer";
import { BrowserRouter } from "react-router-dom";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <MyNavbar />
      <Head>
        <title>Collectors Hideout</title>
      </Head>
        <Component {...pageProps} />
      <SiteFooter />
    </Providers>
  );
}
