import "../styles/globals.css";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { Auth0Provider } from "@auth0/auth0-react";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>Chat-Collaborator</title>
			</Head>
			<Auth0Provider
				domain="dev-xaiwxbt5zhvcm734.us.auth0.com"
				clientId="d6kleGemj9gBSePxQ0yqoJ7XbVkG9bLe"
				redirectUri="http://localhost:3000">
				<ChakraProvider theme={theme}>
					<Component {...pageProps} />
				</ChakraProvider>
			</Auth0Provider>{" "}
		</>
	);
}

export default MyApp;
