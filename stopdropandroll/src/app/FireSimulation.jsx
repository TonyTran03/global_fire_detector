import React, { useRef, useEffect } from "react";

// Constants
const FIRE = 255;
const NO_FIRE = 0;
const WATER = -1;
const BURNED = -2;

// Initial grid setup
const initialGrid = (N, onPositions) => {
  const grid = [];
  //   for (let i = 0; i < N; i++) {
  //     grid[i] = [];
  //     for (let j = 0; j < N; j++) {
  //       grid[i][j] = {
  //         value: NO_FIRE,
  //         closestWater: 0,
  //         closestFire: 0,
  //         terrainFlammability: 0.1, // Low flammability
  //         flammableDensity: 0.1, // Low density of flammable material
  //         windSpeed: 1, // Low wind speed
  //         temperature: 15, // Lower temperature
  //         humidity: 80, // High humidity
  //         rain: 50, // Significant rain
  //         terrainSlope: 1, // Gentle slope
  //         ticksLit: 0,
  //         burned: false,
  //       };
  //     }
  //   }

  //   // Mark initial fire positions
  //   onPositions.forEach(([x, y]) => {
  //     grid[x][y] = {
  //       value: FIRE,
  //       closestWater: 10,
  //       closestFire: 0,
  //       terrainFlammability: 0.1, // Low flammability
  //       flammableDensity: 0.1, // Low density of flammable material
  //       windSpeed: 1, // Low wind speed
  //       temperature: 15, // Lower temperature
  //       humidity: 80, // High humidity
  //       rain: 50, // Significant rain
  //       terrainSlope: 1, // Gentle slope
  //       ticksLit: 0,
  //       burned: false,
  //     };
  //   });

  for (let i = 0; i < N; i++) {
    grid[i] = [];
    for (let j = 0; j < N; j++) {
      grid[i][j] = {
        value: NO_FIRE,
        closestWater: 0,
        closestFire: 0,
        terrainFlammability: 0.9, // High flammability
        flammableDensity: 0.9, // High density of flammable material
        windSpeed: 5, // High wind speed
        temperature: 35, // Higher temperature
        humidity: 20, // Low humidity
        rain: 0, // No rain
        terrainSlope: 5, // Steep slope
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
      terrainFlammability: 0.9, // High flammability
      flammableDensity: 0.9, // High density of flammable material
      windSpeed: 5, // High wind speed
      temperature: 35, // Higher temperature
      humidity: 20, // Low humidity
      rain: 0, // No rain
      terrainSlope: 5, // Steep slope
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

// Color scaling function for heatmap effect
const getHeatColor = (value) => {
  // Normalize value to be between 0 and 1
  const normalized = Math.min(Math.max(value, 0), 1);

  // Color gradient based on normalized value
  const r = Math.floor(255 * normalized);
  const g = Math.floor(255 * (1 - normalized));
  const b = Math.floor(255 * (1 - normalized) * 0.5);

  return [r, g, b];
};

// Fire color based on intensity and age
const fireColor = (cell) => {
  if (cell.value === NO_FIRE) {
    if (cell.burned) {
      return [51, 51, 51]; // Gray for burned cells
    } else {
      return [0, 179, 0]; // Green for cells that are not on fire and not burned
    }
  }

  // For fire cells, the color dims with more ticks.
  const intensity = Math.max(0, 1 - cell.ticksLit / 10000.0); // Diminish intensity with ticks
  const r = intensity * Math.random() * (1.0 - 1.0) + 1.0; // Add a slight flicker
  const g = intensity * Math.random() * (0.6 - 0.4) + 0.4;
  const b = 0; // Pure red/orange-yellow flames

  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
};

// Update simulation (fire spread, extinguish, etc.)
const updateFire = (grid, N) => {
  const windDirectionX = 1; // 1 is up, 0 is no, -1 is down (N, NE, E, SE, S, SW, W, NW)
  const windDirectionY = -1; // 1 is left, 0 is no, -1 is right (N, NE, E, SE, S, SW, W, NW)
  const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy the grid

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      let totalFireNeighbors = 0;

      // Count the number of fire neighbors
      for (let di = -2; di <= 2; di++) {
        for (let dj = -2; dj <= 2; dj++) {
          if (di === 0 && dj === 0) continue;
          const ni = (i + di + N) % N;
          const nj = (j + dj + N) % N;
          if (grid[ni][nj].value === FIRE) totalFireNeighbors++;
        }
      }

      const cell = grid[i][j];

      if (cell.value === FIRE) {
        const flammabilityFactor =
          cell.terrainFlammability * (1 - cell.humidity / 100);
        const windFactor = 1 + cell.windSpeed / 10;
        const temperatureFactor =
          1 +
          cell.closestFire / 10 -
          totalFireNeighbors / 12 +
          (cell.temperature - 30) / 100;
        const rainFactor = 1 - cell.rain / 100;
        const slopeFactor = 1 + cell.terrainSlope / 10;
        const extinguishProbability =
          0.01 *
          (1 -
            flammabilityFactor *
              windFactor *
              temperatureFactor *
              rainFactor *
              slopeFactor);

        if (cell.ticksLit > 10000000 || Math.random() < extinguishProbability) {
          newGrid[i][j].value = NO_FIRE;
          newGrid[i][j].burned = true;
        } else {
          newGrid[i][j].ticksLit += 1;
        }
      } else {
        if (cell.closestFire < 2 && !cell.burned) {
          const flammabilityFactor =
            cell.terrainFlammability * (1 - cell.humidity / 100);
          const windFactor = 1 + cell.windSpeed / 10;
          const temperatureFactor = 1 + (cell.temperature - 30) / 100;
          const rainFactor = 1 - cell.rain / 100;
          const slopeFactor = 1 + cell.terrainSlope / 10;
          const ignitionProbability =
            0.01 *
            flammabilityFactor *
            windFactor *
            temperatureFactor *
            rainFactor *
            slopeFactor *
            (grid[(i + windDirectionX + N) % N][(j + windDirectionY + N) % N]
              .value === FIRE
              ? 10
              : 1);

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
const FireSimulation = ({ N = 100, updateInterval = 500, pixelSize = 10 }) => {
  const canvasRef = useRef(null);
  const grid = useRef(
    initialGrid(N, [
      [N - 1, 0],
      [N - 1, 1],
      [N - 2, 0],
      [N - 2, 1],
      [N - 3, 0],
      [N - 3, 1],
      [N - 4, 0],
      [N - 4, 1],
    ])
  );
  const ctxRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    // Set canvas size based on grid size and pixel size
    canvas.width = N * pixelSize;
    canvas.height = N * pixelSize;

    const animateFire = () => {
      const gridData = grid.current;
      const newGrid = updateFire(gridData, N);

      // Update grid and draw to canvas
      grid.current = newGrid;

      // Loop over each grid cell and draw larger rectangles (pixels)
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const color = fireColor(gridData[i][j]);
          const x = i * pixelSize; // X position for the pixel
          const y = j * pixelSize; // Y position for the pixel

          // Set the fill color based on the fire color
          ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
          ctx.fillRect(x, y, pixelSize, pixelSize); // Draw each cell as a larger square
        }
      }

      // Schedule the next frame
      animationRef.current = setTimeout(animateFire, updateInterval);
    };

    animateFire(); // Start animation loop

    return () => clearTimeout(animationRef.current);
  }, [N, updateInterval, pixelSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid #000", backgroundColor: "#2c3e50" }}
    />
  );
};

export default FireSimulation;
