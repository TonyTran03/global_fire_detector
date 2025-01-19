import React, { useRef, useEffect } from "react";

function generateNoise(width, height, scale = 0.1) {
    const noiseArray = new Float32Array(width * height);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const nx = x / width - 0.5;
            const ny = y / height - 0.5;
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
            imageData.data[i * 4] = noise[i] * 115; // R
            imageData.data[i * 4 + 1] = noise[i] * 10; // G
            imageData.data[i * 4 + 2] = noise[i] * 255; // B
            imageData.data[i * 4 + 3] = 255; // A
        }

        ctx.putImageData(imageData, 0, 0);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ zIndex: -1 }}
        ></canvas>
    );
}
