import type { AppProps } from "next/app";
import Head from "next/head";
// Libraries
import { ThemeProvider } from "@mui/material/styles";
// Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
// Hooks
import { AuthProvider } from "@/hooks/useAuth";
import { CohortProvider } from "@/hooks/useCohort";
// Styling
import "../styles/globals.scss";
import { theme } from "@/styles/muiTheme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>NUS Skylab</title>
        <meta name="description" content="NUS Skylab" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CohortProvider>
        <AuthProvider>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </AuthProvider>
      </CohortProvider>
    </ThemeProvider>
  );
}

export default MyApp;
