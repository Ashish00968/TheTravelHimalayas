import { notFound } from "next/navigation";
import { Metadata } from "next";
import { himalayaAtlas, getRegion, getSubRegion } from "@/data/atlas";
import { DivisionClient } from "./DivisionClient";
import { generatePageMetadata } from "@/lib/seo";
import { buildTouristDestinationJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";

export function generateStaticParams() {
  const params: { state: string; division: string }[] = [];
  himalayaAtlas.forEach((region) => {
    region.subregions.forEach((sub) => {
      params.push({ state: region.id, division: sub.id });
    });
  });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; division: string }>;
}): Promise<Metadata> {
  const { state, division } = await params;
  const region = getRegion(state);
  const subRegion = getSubRegion(state, division);

  if (!region || !subRegion) return {};

  const placeNames = subRegion.places.slice(0, 5).map((p) => p.name).join(", ");

  return generatePageMetadata({
    title: `Treks & Trails in ${subRegion.name} — ${region.name} Valley Guide`,
    description:
      subRegion.tagline ||
      `Explore ${subRegion.places.length} verified treks, peaks, and alpine passes in ${subRegion.name}, ${region.name}. Featuring ${placeNames}.`,
    path: `/explore/${state}/${division}`,
    image: region.image,
    keywords: [
      `${subRegion.name} treks`,
      `${subRegion.name} trails`,
      `${subRegion.name} trekking routes`,
      `hiking in ${subRegion.name}`,
      `${region.name} expeditions`,
      ...subRegion.places.map((p) => p.name),
    ],
  });
}

export default async function DivisionPage({
  params,
}: {
  params: Promise<{ state: string; division: string }>;
}) {
  const { state, division } = await params;
  const region = getRegion(state);
  const subRegion = getSubRegion(state, division);

  if (!region || !subRegion) notFound();

  const destinationSchema = buildTouristDestinationJsonLd({
    name: `${subRegion.name}, ${region.name}`,
    description: subRegion.tagline || `Alpine trekking routes and passes in ${subRegion.name}`,
    url: `/explore/${state}/${division}`,
    image: region.image,
    containedInPlace: region.name,
  });

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: region.name, href: `/explore/${state}` },
    { label: subRegion.name, href: `/explore/${state}/${division}` },
  ]);

  return (
    <>
      <DivisionClient
        state={state}
        division={division}
        region={region}
        subRegion={subRegion}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(destinationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
    </>
  );
}
