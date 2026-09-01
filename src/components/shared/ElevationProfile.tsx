"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ItineraryDay {
  day: number;
  title: string;
  elevationMeters?: number;
  distanceKm?: number;
}

export function ElevationProfile({ itinerary }: { itinerary: ItineraryDay[] }) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Filter out days without elevation
  const points = itinerary.filter((d) => d.elevationMeters !== undefined);

  if (points.length < 2) return null;

  // Calculate scales
  const maxElev = Math.max(...points.map((d) => d.elevationMeters!));
  const minElev = Math.min(...points.map((d) => d.elevationMeters!));
  
  // Padding for the chart bounds
  const yPadding = 500; 
  const chartMaxY = maxElev + yPadding;
  const chartMinY = Math.max(0, minElev - yPadding);
  
  const width = 1000;
  const height = 400;

  // X scale mapping (spread points evenly)
  const getX = (index: number) => {
    const usableWidth = width - 100;
    return 50 + (index / (points.length - 1)) * usableWidth;
  };

  // Y scale mapping (invert Y because SVG 0 is at top)
  const getY = (elevation: number) => {
    const usableHeight = height - 100;
    const ratio = (elevation - chartMinY) / (chartMaxY - chartMinY);
    return height - 50 - ratio * usableHeight;
  };

  // Generate the SVG path
  const pathD = points.map((p, i) => {
    const x = getX(i);
    const y = getY(p.elevationMeters!);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(" ");

  // Create the filled area path (pathD + bottom corners)
  const fillPathD = `${pathD} L ${getX(points.length - 1)} ${height - 50} L ${getX(0)} ${height - 50} Z`;

  return (
    <div className="w-full relative overflow-hidden bg-surface border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
      <div className="mb-8">
        <h3 className="text-xl font-display font-semibold text-white mb-2">Elevation Profile</h3>
        <p className="text-white/60 text-sm font-light">Interactive altitude map across the itinerary.</p>
      </div>

      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-[600px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = height - 50 - ratio * (height - 100);
              const elevValue = Math.round(chartMinY + ratio * (chartMaxY - chartMinY));
              return (
                <g key={ratio} className="text-white/20">
                  <line x1="50" y1={y} x2={width - 50} y2={y} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <text x="40" y={y + 4} fill="currentColor" fontSize="12" textAnchor="end" className="font-light">
                    {elevValue}m
                  </text>
                </g>
              );
            })}

            {/* Filled Area */}
            <motion.path
              d={fillPathD}
              fill="url(#elevationGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />

            {/* Main Line */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Points and Tooltips */}
            {points.map((p, i) => {
              const x = getX(i);
              const y = getY(p.elevationMeters!);
              const isHovered = hoveredDay === p.day;

              return (
                <g 
                  key={p.day}
                  onMouseEnter={() => setHoveredDay(p.day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="cursor-pointer"
                >
                  {/* Invisible larger circle for easier hovering */}
                  <circle cx={x} cy={y} r="20" fill="transparent" />
                  
                  {/* Point */}
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={isHovered ? "8" : "5"} 
                    fill="var(--background)" 
                    stroke="var(--primary)" 
                    strokeWidth="3" 
                    className="transition-all duration-300"
                  />
                  
                  {/* Day Label on X axis */}
                  <text x={x} y={height - 20} fill={isHovered ? "var(--primary)" : "rgba(255,255,255,0.6)"} fontSize="14" textAnchor="middle" className="font-medium transition-colors">
                    Day {p.day}
                  </text>

                  {/* Distance (if available) */}
                  {p.distanceKm && (
                    <text x={x} y={height - 5} fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle" className="font-light">
                      {p.distanceKm} km
                    </text>
                  )}

                  {/* Tooltip */}
                  {isHovered && (
                    <g>
                      <rect 
                        x={x - 100} 
                        y={y - 80} 
                        width="200" 
                        height="60" 
                        rx="8" 
                        fill="#121216" 
                        stroke="rgba(255,255,255,0.1)" 
                        strokeWidth="1"
                      />
                      <text x={x} y={y - 55} fill="white" fontSize="14" fontWeight="600" textAnchor="middle">
                        {p.elevationMeters} m
                      </text>
                      <text x={x} y={y - 35} fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="middle" className="font-light truncate">
                        {p.title.length > 25 ? p.title.substring(0, 25) + '...' : p.title}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
