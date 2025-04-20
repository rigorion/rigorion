
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { format } from 'date-fns';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface PerformanceDataPoint {
  date: string;
  attempted: number;
}

interface ProgressChartProps {
  data: PerformanceDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 border border-indigo-100/50 shadow-xl rounded-lg">
        <p className="font-medium text-indigo-900">{`Date: ${label}`}</p>
        <p className="text-indigo-600 font-semibold">{`Questions: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const ProgressChart = ({ data = [] }: ProgressChartProps) => {
  const formattedData = data.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    questions: item.attempted
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        barSize={32}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke="#E5E5E5" 
          opacity={0.4} 
        />
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          dy={10}
          tick={{ fill: '#4B5563', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          dx={-10}
          tick={{ fill: '#4B5563', fontSize: 12 }}
          label={{ 
            value: 'Questions Attempted', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: '#4B5563', fontSize: 13 }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity={0.95}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.85}/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <Bar
          dataKey="questions"
          fill="url(#barGradient)"
          radius={[6, 6, 0, 0]}
          filter="url(#glow)"
          animationDuration={1500}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
