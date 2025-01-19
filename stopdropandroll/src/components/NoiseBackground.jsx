import React, { useRef, useEffect } from "react";

function generateNoise(width, height, scale = 0.1) {
    const noiseArray = new Float32Array(width * height);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            noiseArray[x + y * width] = Math.random() * scale; // Replace with real noise logic if desired
        }
    }
    return noiseArray;
}

export default function NoiseBackground() {
    const canvasRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const width = canvas.width = window.innerWidth;
        const height = canvas.height = window.innerHeight;

        const noise = generateNoise(width, height);

        const imageData = ctx.createImageData(width, height);
        for (let i = 0; i < noise.length; i++) {
            imageData.data[i * 4] = noise[i] * 125; // R
            imageData.data[i * 4 + 1] = noise[i] * 255; // G
            imageData.data[i * 4 + 2] = noise[i] * 255; // B
            imageData.data[i * 4 + 3] = 50;
        }

        ctx.putImageData(imageData, 0, 0);
    }, []);

    return (
        <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
                zIndex: -1,
                background:
                    "linear-gradient(180deg, rgba(255,125,78,1) 1%, rgba(255,151,113,1) 55%, rgba(73,73,73,1) 99%)",
            }}
        >
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
            ></canvas>
        </div>
    );
}
