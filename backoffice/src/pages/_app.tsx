import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Providers from "./providers";
import MyNavbar from "../../components/navbar";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "../../utils/cookies";
import { Button, Input } from "@nextui-org/react";

export default function App({ Component, pageProps }: AppProps) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const authenticate = async () => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.status === 200) {
        const { token } = await response.json();

        const isAuthenticated = token && token.trim() !== "";
        setCookie("auth-token", token);
        setAuthenticated(isAuthenticated);
      } else {
        const data = await response.json();

        const errorMessage =
          data && data.message ? data.message : "Authorization denied!";

        alert(errorMessage);
      }
    } catch (error) {
      alert("Error during authentication!");
    }
  };

  useEffect(() => {
    const isTokenValid = (token: string | undefined) => {
      return token !== undefined && token.trim() !== "";
    };

    const authenticationToken = getCookie("auth-token");
    const isAuthenticated = isTokenValid(authenticationToken);

    setAuthenticated(isAuthenticated);
  }, []);

  if (authenticated === null) {
    return <div></div>;
  }

  if (!authenticated) {
    return (
      <>
        <Head>
          <title>Collectors Hideout</title>
        </Head>
        <div className="mx-auto mt-4 bg-indigo-950 w-[350px] h-[230px] flex justify-center items-center flex flex-col rounded-lg">
          <text className="text-white text-large">Enter the credentials</text>
          <Input
            className="flex text-zind-700 bg-white rounded-lg w-[95%] mt-2"
            autoFocus
            type="text"
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            className="flex text-zind-700 bg-white rounded-lg w-[95%] mt-3"
            autoFocus
            type="password"
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            color="danger"
            className="mt-2 ml-auto mr-2"
            onPress={authenticate}
          >
            Authenticate
          </Button>
        </div>
      </>
    );
  }

  return (
    <Providers>
      <MyNavbar />
      <Head>
        <title>Collectors Hideout</title>
      </Head>
      <Component {...pageProps} />
    </Providers>
  );
}
