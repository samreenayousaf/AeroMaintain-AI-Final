import { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import world from "world-atlas/countries-110m.json";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { HeatmapAircraft } from "@/features/dashboard/data";

interface FleetHeatmapProps {
  aircraft: HeatmapAircraft[];
  isLoading?: boolean;
}

/* ── Color legend entry ── */
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
      />
      {label}
    </span>
  );
}

export function FleetHeatmap({ aircraft, isLoading }: FleetHeatmapProps) {
  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="h-[340px] flex items-center justify-center">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      );
    }

    if (!aircraft.length) {
      return (
        <div className="flex h-[340px] items-center justify-center">
          <p className="text-sm text-muted-foreground">No aircraft position data available.</p>
        </div>
      );
    }

    return (
      <div className="h-[340px]">
        <ComposableMap
          projectionConfig={{ scale: 155, center: [10, 25] }}
          style={{ width: "100%", height: "100%" }}
          className="opacity-80"
        >
          {/* Continents */}
          <Geographies geography={world}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#0F172A"
                  stroke="#1E293B"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#18233A", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Aircraft markers */}
          {aircraft.map((a) => (
            <Marker key={a.id} coordinates={[a.coordinates[0], a.coordinates[1]]}>
              <g>
                {/* Glow ring */}
                <circle
                  r={10}
                  fill={a.color}
                  opacity={0.12}
                  className="animate-pulse"
                />
                {/* Core dot */}
                <circle
                  r={4}
                  fill={a.color}
                  stroke="#07111F"
                  strokeWidth={1.5}
                  style={{
                    filter: `drop-shadow(0 0 4px ${a.color}80)`,
                    cursor: "pointer",
                  }}
                />
                {/* Label on hover — in react-simple-maps, Marker children render as SVG, so this is a
                    tooltip alternative using <title> for native browser tooltips */}
                <title>
                  {a.tailNumber} · {a.model} · {a.healthScore}% · {a.location}
                </title>
              </g>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    );
  }, [aircraft, isLoading]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-base font-semibold">Fleet Heatmap</CardTitle>
        <div className="flex items-center gap-3">
          <LegendDot color="#10B981" label="Healthy" />
          <LegendDot color="#F59E0B" label="Watch" />
          <LegendDot color="#EF4444" label="Critical" />
          <LegendDot color="#3B82F6" label="Maintenance" />
        </div>
      </CardHeader>
      <CardContent className="pt-3">{content}</CardContent>
    </Card>
  );
}