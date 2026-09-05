"use client";

import React, { useEffect, useState } from "react";
import { Cloud, Wind, Snowflake, Sun, CloudRain, Droplets } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherWidgetProps {
  coords: [number, number]; // [lat, lng]
  locationName: string;
}

interface WeatherData {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    precipitation: number;
    weather_code: number;
    snowfall: number;
  };
}

export function MountainWeatherWidget({ coords, locationName }: WeatherWidgetProps) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const lat = coords?.[0];
  const lng = coords?.[1];

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      if (typeof lat !== "number" || typeof lng !== "number" || isNaN(lat) || isNaN(lng)) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);
        // Open-Meteo API (Free, no key required)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code,snowfall&timezone=auto`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Failed to fetch weather");
        const json = await response.json();
        setData(json);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Silently ignore component unmount cancellation
        }
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();

    return () => {
      controller.abort();
    };
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="w-full h-48 bg-card border border-border rounded-3xl animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full p-6 glass-museum-card text-foreground/60 text-center text-sm font-light">
        Live weather unavailable for this location.
      </div>
    );
  }

  const { current } = data;
  
  // Basic WMO Weather Code Mapper
  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="w-12 h-12 text-amber-500" />;
    if (code === 2 || code === 3) return <Cloud className="w-12 h-12 text-muted-foreground" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-12 h-12 text-blue-500" />;
    if (code >= 71 && code <= 77) return <Snowflake className="w-12 h-12 text-cyan-600 dark:text-cyan-300" />;
    return <Cloud className="w-12 h-12 text-muted-foreground/70" />;
  };

  const getWeatherText = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code === 1 || code === 2 || code === 3) return "Partly Cloudy";
    if (code >= 51 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    return "Overcast";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full relative overflow-hidden glass-museum-card p-6 md:p-8 shadow-xl"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5">
        {getWeatherIcon(current.weather_code)}
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="font-mono text-xs text-primary uppercase tracking-[0.2em] font-bold block mb-1">
            Live Conditions
          </span>
          <h3 className="font-display tracking-tight font-semibold text-xl text-foreground">
            {locationName}
          </h3>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-3">
            {getWeatherIcon(current.weather_code)}
            <span className="text-4xl font-display font-bold text-foreground">
              {Math.round(current.temperature_2m)}°
            </span>
          </div>
          <span className="text-foreground/70 text-sm font-light mt-1">
            {getWeatherText(current.weather_code)} (Feels like {Math.round(current.apparent_temperature)}°)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted/60 dark:bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Wind className="w-5 h-5 text-primary mb-2" />
          <span className="text-foreground font-semibold">{current.wind_speed_10m} km/h</span>
          <span className="text-muted-foreground text-xs font-mono uppercase mt-1">Wind</span>
        </div>
        
        <div className="bg-muted/60 dark:bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Droplets className="w-5 h-5 text-blue-500 mb-2" />
          <span className="text-foreground font-semibold">{current.precipitation} mm</span>
          <span className="text-muted-foreground text-xs font-mono uppercase mt-1">Precip</span>
        </div>

        <div className="bg-muted/60 dark:bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Snowflake className="w-5 h-5 text-primary mb-2" />
          <span className="text-foreground font-semibold">{current.snowfall} cm</span>
          <span className="text-muted-foreground text-xs font-mono uppercase mt-1">Snow</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground font-mono">
        <span>Powered by Open-Meteo</span>
        <span className="flex items-center gap-1">Live <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ml-1" /></span>
      </div>
    </motion.div>
  );
}
