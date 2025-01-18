'use client';

import FireSimulation from "./FireSimulation";

export default function Home() {
  
  return (
    <div>
      <FireSimulation N={80} updateInterval={100} />
    </div>
  );
}
