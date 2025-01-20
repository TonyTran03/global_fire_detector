"use client";
import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import NoiseBackground from "../../src/components/NoiseBackground";
import { TruckModel } from "../../src/components/TruckModel";
import HeroVideoDialog from "../../src/components/ui/hero-video-dialog";
import { WarpBackground } from "../../src/components/ui/warp-background";

import { RainbowButton } from "../../src/components/ui/rainbow-button";
import { ShinyButton } from "../../src/components/ui/shiny-button";

export default function HomePage() {
  const [perspective, setPerspective] = useState(100);

  return (
    <div className="relative flex flex-col lg:flex-row justify-center w-screen h-screen overflow-visible">
      {/* Warp Animation Background */}
      <WarpBackground
        className="absolute inset-0 z-0"
        perspective={perspective}
        beamsPerSide={5}
        beamSize={5}
        beamDelayMax={3}
        beamDelayMin={0.5}
        beamDuration={2.5}
        gridColor="hsl(240, 50%, 20%)"
      />

      {/* Background Noise */}
      <NoiseBackground />

      {/* Text Section */}
      <div className="relative z-10 lg:basis-2/3 grow font-poppinsl text-center lg:text-left text-white font-sans px-8 py-4 flex flex-col justify-center items-center lg:items-start">
        {/* Glass Background */}
        <div className="relative inset-0 bg-gradient-to-r h-1/2 flex justify-center items-center from-white/10 to-white/20 backdrop-blur-lg rounded-lg shadow-lg z-[-1]" />

        {/* Hero Video Dialog */}
        <div className="w-full max-w-md lg:max-w-lg mb-6">
          <HeroVideoDialog
            className="dark:hidden block"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
            thumbnailAlt="Go to Map"
          />
          <HeroVideoDialog
            className="hidden dark:block"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Go to Map"
          />
        </div>

        {/* Title and Description */}
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-Hero font-extrabold mb-4 leading-tight">
          Global Fire Detector
        </h1>
        <p className="text-base sm:text-lg font-PoppinsL lg:text-xl leading-relaxed mb-8">
          Complex Machine Learning Algorithm to Detect Wildfires in Real Time.
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <ShinyButton>Learn More</ShinyButton>
          <RainbowButton> Try it now!</RainbowButton>
        </div>
      </div>

      {/* Canvas Section */}
      <div className="relative z-20 flex justify-center items-center h-screen w-full overflow-visible">
        <Suspense fallback={<div>Loading 3D Model...</div>}>
          <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 10, 5]} intensity={2} />
            <TruckModel />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
}
