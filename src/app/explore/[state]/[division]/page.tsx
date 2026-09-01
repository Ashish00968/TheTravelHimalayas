import { notFound } from "next/navigation";
import { Metadata } from "next";
import { himalayaAtlas, getRegion, getSubRegion } from "@/data/atlas";
import { DivisionClient } from "./DivisionClient";

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

  return {
    title: `${subRegion.name} Trails, Peaks & Places | ${region.name} | The Himalayan Trails`,
    description:
      subRegion.tagline ||
      `Explore all treks, day hikes, peaks, and scenic places in ${subRegion.name}, ${region.name}.`,
    alternates: {
      canonical: `https://thehimalayantrails.com/explore/${state}/${division}`,
    },
  };
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

  return (
    <DivisionClient
      state={state}
      division={division}
      region={region}
      subRegion={subRegion}
    />
  );
}
