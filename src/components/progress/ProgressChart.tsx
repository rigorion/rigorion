
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
      <div className="bg-white/95 backdrop-blur-sm p-3 border border-purple-200 shadow-lg rounded-lg">
        <p className="font-medium text-purple-900">{`Date: ${label}`}</p>
        <p className="text-purple-600 font-semibold">{`Questions: ${payload[0].value}`}</p>
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
        barSize={30}
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
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          dx={-10}
          tick={{ fill: '#6B7280', fontSize: 12 }}
          label={{ 
            value: 'Questions Attempted', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 13 }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9b87f5" stopOpacity={0.95}/>
            <stop offset="95%" stopColor="#7E69AB" stopOpacity={0.85}/>
          </linearGradient>
          <filter id="barGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <Bar
          dataKey="questions"
          fill="url(#barGradient)"
          radius={[4, 4, 0, 0]}
          filter="url(#barGlow)"
          animationDuration={1500}
          animationEasing="ease-out"
          className="drop-shadow-md"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
