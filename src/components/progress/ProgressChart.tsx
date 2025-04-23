
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, TooltipProps } from 'recharts';
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
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-medium text-gray-600 mb-2">{`Date: ${label}`}</p>
        {payload.map((entry, index) => (
          <p 
            key={index} 
            className="text-sm"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value}
            {entry.name === 'Momentum' ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom dot component for momentum line that changes color based on value
const CustomizedDot = (props: any) => {
  const { cx, cy, value } = props;
  const color = value >= 0 ? '#22c55e' : '#ef4444';
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={3} 
      fill={color}
      stroke="white"
      strokeWidth={1}
    />
  );
};

export const ProgressChart = ({ data = [] }: ProgressChartProps) => {
  // Calculate momentum (percent change from previous day)
  const enrichedData = data.map((item, index) => {
    const prevAttempted = index > 0 ? data[index - 1].attempted : item.attempted;
    const momentum = prevAttempted === 0 ? 0 : 
      ((item.attempted - prevAttempted) / prevAttempted * 100);
    
    return {
      date: format(new Date(item.date), 'MMM dd'),
      questions: item.attempted,
      momentum: Number(momentum.toFixed(1))
    };
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Daily Performance Chart</h3>
        <span className="text-sm font-medium text-gray-600">
          Avg: {Math.round(data.reduce((acc, curr) => acc + curr.attempted, 0) / data.length)} questions/day
        </span>
      </div>

      {/* Questions Chart */}
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={enrichedData}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" opacity={0.4} />
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
                value: 'Questions',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 13 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />
            <Line
              type="linear"
              dataKey="questions"
              stroke="#1e40af"
              strokeWidth={1.5}
              dot={{ fill: '#1e40af', strokeWidth: 1, r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              name="Questions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Momentum Chart */}
      <div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart
            data={enrichedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" opacity={0.4} />
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
                value: 'Momentum (%)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 13 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />
            <Line
              type="linear"
              dataKey="momentum"
              stroke="#4B5563"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={<CustomizedDot />}
              activeDot={{ r: 5, strokeWidth: 0 }}
              name="Momentum"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

