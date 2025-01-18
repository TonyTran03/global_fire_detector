import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

FIRE = 255
NO_FIRE = 0
WATER = -1
BURNED = -2

def closest_fire(grid, N):
    fire_positions = [(i, j) for i in range(N) for j in range(N) if grid[i, j]["value"] == FIRE]
    for i in range(N):
        for j in range(N):
            closest_fire = min(max(abs(k-i), abs(l-j)) for k, l in fire_positions)
            grid[i, j]["closestFire"] = closest_fire
    return grid

def initial_grid(N, on_positions):
    grid = np.zeros((N, N), dtype=[('value', 'i4'), ('closestWater', 'i4'), ('closestFire', 'i4'),
                                   ('terrainFlamability', 'f4'), ('flamableDensity', 'f4'),
                                   ('windSpeed', 'i4'), ('temperature', 'i4'), ('humidity', 'i4'),
                                   ('rain', 'i4'), ('terrainSlope', 'i4'), ('ticksLit', 'i4'),
                                   ('burned', 'b')])
    for i in range(N):
        for j in range(N):
            grid[i, j] = (NO_FIRE, 0, 0, 0.8, 0.5, 5, 35, 20, 0, 3, 0, False)
    for pos in on_positions:
        grid[pos] = (FIRE, 10, 0, 0.8, 0.5, 5, 35, 20, 0, 3, 0, False)

    closest_fire(grid, N)
    return grid

def fire_color(cell):
    """Determine the color based on the fire intensity and age (ticksLit)."""
    if cell["value"] == NO_FIRE:
        if cell["burned"]:
            return [0.2, 0.2, 0.2]  # Gray for burned cells
        else:
            return [0, 0.7, 0]  # Green for cells that are not on fire and not burned

    # For fire cells, the color dims with more ticks.
    intensity = max(0, 1 - cell["ticksLit"] / 10000.0)  # Diminish intensity with ticks
    r = intensity * np.random.uniform(1.0, 1.0)  # Add a slight flicker
    g = intensity * np.random.uniform(0.4, 0.6)
    b = 0  # Pure red/orange-yellow flames

    return [r, g, b]

def update(frameNum, img, grid, N):
    windDirection = 1  # Random wind direction, 0-7
    newGrid = grid.copy()

    for i in range(N):
        for j in range(N):
            total_fire_neighbors = sum(grid[(i + di) % N, (j + dj) % N]["value"] == FIRE
                                       for di in range(-1, 2) for dj in range(-1, 2) if (di, dj) != (0, 0))

            if newGrid[i, j]["value"] == FIRE:
                # Fire burns out depending on environmental factors
                flammability_factor = newGrid[i, j]["terrainFlamability"] * (1 - newGrid[i, j]["humidity"] / 100)
                wind_factor = (1 + newGrid[i, j]["windSpeed"] / 10) * (1 if windDirection in [(i+1)%8, (i-1)%8] else 0.5)
                temperature_factor = 1 + (newGrid[i, j]["temperature"] - 30) / 100
                rain_factor = 1 - newGrid[i, j]["rain"] / 100
                slope_factor = 1 + newGrid[i, j]["terrainSlope"] / 10
                extinguish_probability = 0.01 * (1 - flammability_factor * wind_factor * temperature_factor * rain_factor * slope_factor)
                
                if grid[i, j]["ticksLit"] > 1000000000 or np.random.rand() < extinguish_probability:
                    newGrid[i, j]["value"] = NO_FIRE
                    newGrid[i, j]["burned"] = True
                else:
                    newGrid[i, j]["ticksLit"] += 1
            else:
                # Fire spreads to nearby cells depending on environmental factors
                if total_fire_neighbors > 5 or newGrid[i, j]["closestFire"] < 2 and not newGrid[i, j]["burned"]:
                    flammability_factor = newGrid[i, j]["terrainFlamability"] * (1 - newGrid[i, j]["humidity"] / 100)
                    wind_factor = (1 + newGrid[i, j]["windSpeed"] / 10) * (1 if windDirection in [(i+1)%8, (i-1)%8] else 0.5)
                    temperature_factor = 1 + (newGrid[i, j]["temperature"] - 30) / 100
                    rain_factor = 1 - newGrid[i, j]["rain"] / 100
                    slope_factor = 1 + newGrid[i, j]["terrainSlope"] / 10
                    ignition_probability = 0.01 * flammability_factor * wind_factor * temperature_factor * rain_factor * slope_factor
                    if np.random.rand() < ignition_probability:
                        newGrid[i, j]["value"] = FIRE
                        newGrid[i, j]["ticksLit"] = 0

    closest_fire(newGrid, N)

    # Apply fire color based on intensity and age
    color_grid = np.array([[fire_color(cell) for cell in row] for row in newGrid])
    img.set_data(color_grid)
    grid[:] = newGrid[:]
    return img,

def main():
    N = 100
    updateInterval = 50
    grid = initial_grid(N, [(N//2, N//2), (N//2, N//2+1), (N//2, N//2-1)])
    fig, ax = plt.subplots()
    img = ax.imshow([[fire_color(cell) for cell in row] for row in grid], interpolation='nearest')
    ani = animation.FuncAnimation(fig, update, fargs=(img, grid, N),
                                  frames=10, interval=updateInterval, save_count=50)
    plt.show()

if __name__ == '__main__':
    main()
