import React, { useRef, useEffect } from "react";

// Constants
const FIRE = 255;
const NO_FIRE = 0;
const WATER = -1;
const BURNED = -2;

// Initial grid setup
const initialGrid = (N, onPositions) => {
  const grid = [];
  for (let i = 0; i < N; i++) {
    grid[i] = [];
    for (let j = 0; j < N; j++) {
      grid[i][j] = {
        value: NO_FIRE,
        closestWater: 0,
        closestFire: 0,
        terrainFlamability: 0.8,
        flamableDensity: 0.5,
        windSpeed: 5,
        temperature: 35,
        humidity: 20,
        rain: 0,
        terrainSlope: 3,
        ticksLit: 0,
        burned: false,
      };
    }
  }

  // Mark initial fire positions
  onPositions.forEach(([x, y]) => {
    grid[x][y] = {
      value: FIRE,
      closestWater: 10,
      closestFire: 0,
      terrainFlamability: 0.8,
      flamableDensity: 0.5,
      windSpeed: 5,
      temperature: 35,
      humidity: 20,
      rain: 0,
      terrainSlope: 3,
      ticksLit: 0,
      burned: false,
    };
  });

  closestFire(grid, N); // Find closest fire to each grid cell

  return grid;
};

// Find closest fire to each grid cell
const closestFire = (grid, N) => {
  const firePositions = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (grid[i][j].value === FIRE) {
        firePositions.push([i, j]);
      }
    }
  }

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      let closestFireDist = Infinity;
      firePositions.forEach(([fx, fy]) => {
        const dist = Math.max(Math.abs(fx - i), Math.abs(fy - j)); // Manhattan distance
        closestFireDist = Math.min(closestFireDist, dist);
      });
      grid[i][j].closestFire = closestFireDist;
    }
  }

  return grid;
};

// Fire color based on intensity and age
const fireColor = (cell) => {
  if (cell.value === NO_FIRE) {
    return cell.burned ? [0.2, 0.2, 0.2] : [0, 0.7, 0];
  }

  const intensity = Math.max(0, 1 - cell.ticksLit / 10000);
  const r = intensity * Math.random();
  const g = intensity * Math.random() * 0.6;
  const b = 0;

  return [r, g, b];
};

// Update simulation (fire spread, extinguish, etc.)
const updateFire = (grid, N) => {
  const windDirection = 1;
  const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy the grid

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      let totalFireNeighbors = 0;

      // Count the number of fire neighbors
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;
          const ni = (i + di + N) % N;
          const nj = (j + dj + N) % N;
          if (grid[ni][nj].value === FIRE) totalFireNeighbors++;
        }
      }



      const cell = grid[i][j];

      if (cell.value === FIRE) {
        console.log("fire" + i + " " + j);
        const flammabilityFactor = cell.terrainFlamability * (1 - cell.humidity / 100);
        const windFactor = (1 + cell.windSpeed / 10) * (windDirection === (i + 1) % 8 || windDirection === (i - 1) % 8 ? 3 : 0.5);
        const temperatureFactor = 1 + (cell.temperature - 30) / 100;
        const rainFactor = 1 - cell.rain / 100;
        const slopeFactor = 1 + cell.terrainSlope / 10;
        const extinguishProbability = 0.01 * (1 - flammabilityFactor * windFactor * temperatureFactor * rainFactor * slopeFactor);

        if (cell.ticksLit > 1000000000 || Math.random() < extinguishProbability) {
          newGrid[i][j].value = NO_FIRE;
          newGrid[i][j].burned = true;
        } else {
          newGrid[i][j].ticksLit += 1;
        }
      } else {
        if ((totalFireNeighbors > 5 || cell.closestFire < 2) && !cell.burned) {
          const flammabilityFactor = cell.terrainFlamability * (1 - cell.humidity / 100);
          const windFactor = (1 + cell.windSpeed / 10) * (windDirection === (i + 1) % 8 || windDirection === (i - 1) % 8 ? 3 : 0.5);
          const temperatureFactor = 1 + (cell.temperature - 30) / 100;
          const rainFactor = 1 - cell.rain / 100;
          const slopeFactor = 1 + cell.terrainSlope / 10;
          const ignitionProbability = 0.01 * flammabilityFactor * windFactor * temperatureFactor * rainFactor * slopeFactor;

          if (Math.random() < ignitionProbability) {
            newGrid[i][j].value = FIRE;
            newGrid[i][j].ticksLit = 0;
          }
        }
      }
    }
  }

  closestFire(newGrid, N); // Update closest fire information
  return newGrid;
};

// Fire simulation component
const FireSimulation = ({ N = 100, updateInterval = 50 }) => {
  const canvasRef = useRef(null);
  const grid = useRef(initialGrid(N, [[Math.floor(N / 2), Math.floor(N / 2)]]));
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const animateFire = () => {
      const gridData = grid.current;
      const newGrid = updateFire(gridData, N);

      // Update grid and draw to canvas
      grid.current = newGrid;
      const imageData = ctx.createImageData(N, N);
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const color = fireColor(gridData[i][j]);
          const index = (i * N + j) * 4;
          imageData.data[index] = color[0] * 255;
          imageData.data[index + 1] = color[1] * 255;
          imageData.data[index + 2] = color[2] * 255;
          imageData.data[index + 3] = 255; // Alpha
        }
      }

      

      ctx.putImageData(imageData, 0, 0);
        requestAnimationFrame(animateFire);
    };

    animateFire(); // Start animation loop

    return () => cancelAnimationFrame(animateFire);
  }, [N]);

  return <canvas ref={canvasRef} width={10000} height={10000} />;
};

export default FireSimulation;
