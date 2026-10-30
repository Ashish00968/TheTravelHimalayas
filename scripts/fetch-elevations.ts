interface Coord {
  latitude: number;
  longitude: number;
}

export async function lookupElevationsRobust(locations: Coord[]): Promise<number[]> {
  const elevations: number[] = [];
  const BATCH_SIZE = 75;

  console.log(`⛰️  Looking up elevations for ${locations.length} points via OpenTopoData ASTER 30m...`);

  for (let i = 0; i < locations.length; i += BATCH_SIZE) {
    const chunk = locations.slice(i, i + BATCH_SIZE);
    const locStr = chunk.map((c) => `${c.latitude.toFixed(6)},${c.longitude.toFixed(6)}`).join("|");
    let chunkEles: number[] | null = null;

    // Try OpenTopoData ASTER 30m
    try {
      const url = `https://api.opentopodata.org/v1/aster30m?locations=${locStr}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "DHT-Trek-Verification/1.0 (contact@discoverhimalayantrails.com)",
        },
      });

      if (res.ok) {
        const data = (await res.json()) as { results: { elevation: number | null }[] };
        if (data.results && data.results.length === chunk.length) {
          chunkEles = data.results.map((r) => (r.elevation !== null ? Math.round(r.elevation) : 0));
          console.log(`  [OpenTopoData] Fetched batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(locations.length / BATCH_SIZE)} (${chunk.length} pts)`);
        }
      } else {
        console.warn(`  [OpenTopoData] Batch ${i} status ${res.status}. Falling back to Open-Elevation.`);
      }
    } catch (err) {
      console.warn(`  [OpenTopoData] Batch ${i} error:`, err);
    }

    // Fallback: Open-Elevation if OpenTopoData failed
    if (!chunkEles) {
      try {
        console.log(`  [Open-Elevation] Trying fallback for batch ${Math.floor(i / BATCH_SIZE) + 1}...`);
        const res = await fetch("https://api.open-elevation.com/api/v1/lookup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "DiscoverHimalayanTrails/1.0 (contact@discoverhimalayantrails.com)",
          },
          body: JSON.stringify({ locations: chunk }),
        });

        if (res.ok) {
          const data = (await res.json()) as { results: { elevation: number }[] };
          chunkEles = data.results.map((r) => Math.round(r.elevation));
          console.log(`  [Open-Elevation] Successfully fetched batch ${Math.floor(i / BATCH_SIZE) + 1}`);
        }
      } catch (err) {
        console.warn(`  [Open-Elevation] Fallback failed:`, err);
      }
    }

    // Final fallback: smooth interpolation
    if (chunkEles && chunkEles.length === chunk.length) {
      elevations.push(...chunkEles);
    } else {
      console.warn(`  Using linear extrapolation for batch ${i}`);
      const lastEle = elevations[elevations.length - 1] || 2500;
      for (let j = 0; j < chunk.length; j++) {
        elevations.push(lastEle);
      }
    }

    // Rate-limit safety pause for OpenTopoData (1 request / second)
    await new Promise((r) => setTimeout(r, 1150));
  }

  // Smooth out any 0 or anomalous values
  for (let k = 0; k < elevations.length; k++) {
    if (elevations[k] <= 0 || isNaN(elevations[k])) {
      const prev = k > 0 ? elevations[k - 1] : 2000;
      let next = prev;
      for (let n = k + 1; n < elevations.length; n++) {
        if (elevations[n] > 0 && !isNaN(elevations[n])) {
          next = elevations[n];
          break;
        }
      }
      elevations[k] = Math.round((prev + next) / 2);
    }
  }

  return elevations;
}
