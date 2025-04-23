
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
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-purple-200 shadow-lg rounded-lg">
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
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Daily Performance Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={enrichedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#9b87f5" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorMomentum" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7E69AB" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#7E69AB" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
            yAxisId="questions"
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
          <YAxis 
            yAxisId="momentum"
            orientation="right"
            axisLine={false}
            tickLine={false}
            dx={10}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            label={{ 
              value: 'Momentum (%)', 
              angle: 90, 
              position: 'insideRight',
              style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 13 }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="circle"
            iconSize={8}
          />
          <Line
            yAxisId="questions"
            type="monotone"
            dataKey="questions"
            stroke="#9b87f5"
            strokeWidth={2}
            dot={{ fill: '#9b87f5', strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Questions"
          />
          <Line
            yAxisId="momentum"
            type="monotone"
            dataKey="momentum"
            stroke="#7E69AB"
            strokeWidth={2}
            dot={{ fill: '#7E69AB', strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Momentum"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
