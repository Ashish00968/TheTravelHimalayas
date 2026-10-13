import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

interface OsmNode {
  id: string;
  lat: number;
  lon: number;
}

interface OsmWay {
  id: string;
  name: string;
  highway: string;
  nodes: string[];
}

export async function fetchOsmRelation(relationId: string): Promise<{
  nodes: Map<string, OsmNode>;
  ways: Map<string, OsmWay>;
  memberWayIds: string[];
}> {
  console.log(`🌐 Fetching OSM relation ${relationId}...`);
  const res = await fetch(`https://api.openstreetmap.org/api/0.6/relation/${relationId}/full`, {
    headers: {
      "User-Agent": "DiscoverHimalayanTrails/1.0 (https://discoverhimalayantrails.com; contact@discoverhimalayantrails.com)",
    },
  });

  if (!res.ok) {
    throw new Error(`OSM API error: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();

  // Parse nodes
  const nodeRegex = /<node\s+([^>]+)\/>/g;
  const nodes = new Map<string, OsmNode>();
  let m: RegExpExecArray | null;

  while ((m = nodeRegex.exec(xml)) !== null) {
    const attrs = m[1];
    const id = attrs.match(/id="(\d+)"/)?.[1];
    const lat = attrs.match(/lat="([0-9.-]+)"/)?.[1];
    const lon = attrs.match(/lon="([0-9.-]+)"/)?.[1];
    if (id && lat && lon) {
      nodes.set(id, { id, lat: parseFloat(lat), lon: parseFloat(lon) });
    }
  }

  // Parse ways
  const wayRegex = /<way\s+id="(\d+)"[^>]*>([\s\S]*?)<\/way>/g;
  const ways = new Map<string, OsmWay>();

  while ((m = wayRegex.exec(xml)) !== null) {
    const id = m[1];
    const body = m[2];
    const wayNodes: string[] = [];
    const ndRegex = /<nd\s+ref="(\d+)"/g;
    let ndM: RegExpExecArray | null;
    while ((ndM = ndRegex.exec(body)) !== null) {
      wayNodes.push(ndM[1]);
    }
    const name = body.match(/<tag\s+k="name"\s+v="([^"]+)"/)?.[1] || "";
    const highway = body.match(/<tag\s+k="highway"\s+v="([^"]+)"/)?.[1] || "";
    ways.set(id, { id, name, highway, nodes: wayNodes });
  }

  // Parse relation members
  const relRegex = new RegExp(`<relation\\s+id="${relationId}"[^>]*>([\\s\\S]*?)<\\/relation>`);
  const relBody = xml.match(relRegex)?.[1] || "";
  const memberRegex = /<member\s+type="way"\s+ref="(\d+)"/g;
  const memberWayIds: string[] = [];

  while ((m = memberRegex.exec(relBody)) !== null) {
    memberWayIds.push(m[1]);
  }

  console.log(`✅ Parsed OSM Relation ${relationId}: ${nodes.size} nodes, ${ways.size} ways, ${memberWayIds.length} members.`);
  return { nodes, ways, memberWayIds };
}

export async function lookupElevations(
  locations: { latitude: number; longitude: number }[]
): Promise<number[]> {
  console.log(`⛰️  Looking up elevations for ${locations.length} coordinates...`);
  const elevations: number[] = [];
  const BATCH_SIZE = 100;

  for (let i = 0; i < locations.length; i += BATCH_SIZE) {
    const chunk = locations.slice(i, i + BATCH_SIZE);
    try {
      const res = await fetch("https://api.open-elevation.com/api/v1/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locations: chunk }),
      });

      if (res.ok) {
        const data = await res.json();
        for (const r of data.results) {
          elevations.push(Math.round(r.elevation));
        }
      } else {
        console.warn(`Elevation API returned status ${res.status}, using linear fallback`);
        for (let j = 0; j < chunk.length; j++) elevations.push(0);
      }
    } catch (err) {
      console.warn(`Elevation lookup failed for batch ${i}:`, err);
      for (let j = 0; j < chunk.length; j++) elevations.push(0);
    }
  }

  return elevations;
}
