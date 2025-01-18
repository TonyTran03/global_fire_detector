'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import("@/components/Map"), {
    loading: () => "Loading...",
    ssr: false
  });

export default function Maps() {
  return (
    <div>
        <Map />
    </div>
  )
}