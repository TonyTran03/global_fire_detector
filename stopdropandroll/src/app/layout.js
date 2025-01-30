"use client";
import "./globals.css";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // App Router's useRouter
import { useLoading, LoadingProvider } from "../components/LoadingContext";
import Loading from "../components/Loading";
import Nav from "../components/Nav";

function LayoutContent({ children }) {
  const { isLoading, setIsLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Override `router.push` for navigation control
    const originalPush = router.push;
    router.push = async (...args) => {
      handleStart();
      await originalPush(...args);
      handleComplete();
    };

    return () => {
      router.push = originalPush; // Restore original push method
    };
  }, [router, setIsLoading]);

  return (
    <>
      {isLoading && <Loading />}
      <main>{children}</main>
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <LoadingProvider>
          <LayoutContent>{children}</LayoutContent>
        </LoadingProvider>
      </body>
    </html>
  );
}
