import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  import type { MetricSnapshot } from "../../types";
  
  interface CpuChartProps {
    snapshots: MetricSnapshot[];
  }
  
  /**
   * Shows CPU and memory usage over time using Recharts.
   */
  export function CpuChart({ snapshots }: CpuChartProps) {
    if (!snapshots.length) return null;
  
    // Convert snapshots to a simpler shape for the chart
    const data = snapshots.map((m) => ({
      time: new Date(m.timestamp).toLocaleTimeString(),
      cpu: Number(m.cpuUsage.toFixed(1)),
      mem: Number(m.memoryUsage.toFixed(1)),
    }));
  
    return (
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="cpuColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="memColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: "#020617",
                border: "1px solid #1f2937",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="cpu"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#cpuColor)"
              name="CPU %"
            />
            <Area
              type="monotone"
              dataKey="mem"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#memColor)"
              name="Memory %"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
  