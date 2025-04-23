
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, TooltipProps, Bar, ComposedChart, Cell, ReferenceLine } from 'recharts';
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

export const ProgressChart = ({ data = [] }: ProgressChartProps) => {
  // Take exactly 12 data points if more exist
  const lastTwelveData = data.slice(-12);
  
  // Calculate momentum (percent change from previous day)
  const enrichedData = lastTwelveData.map((item, index) => {
    const prevAttempted = index > 0 ? lastTwelveData[index - 1].attempted : item.attempted;
    const momentum = prevAttempted === 0 ? 0 : 
      ((item.attempted - prevAttempted) / prevAttempted * 100);
    
    // Cap momentum values to stay within -2 to 2 range
    const cappedMomentum = Math.max(Math.min(Number(momentum.toFixed(1)), 2), -2);
    
    return {
      date: format(new Date(item.date), 'MMM dd'),
      questions: item.attempted,
      momentum: cappedMomentum
    };
  });

  // Calculate the minimum questions value to set bar scale
  const minQuestions = Math.min(...enrichedData.map(d => d.questions));
  // Set minimum to 80% of the lowest value or 0, whichever is smaller
  const minYAxis = Math.min(minQuestions * 0.8, 0);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Daily Performance Chart</h3>
        <span className="text-sm font-medium text-gray-600">
          Avg: {Math.round(lastTwelveData.reduce((acc, curr) => acc + curr.attempted, 0) / lastTwelveData.length)} questions/day
        </span>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={enrichedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
              yAxisId="questions"
              axisLine={false}
              tickLine={false}
              dx={-10}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              domain={[minYAxis, 'auto']}
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
              axisLine={{ stroke: '#E5E5E5' }}
              tickLine={false}
              dx={10}
              domain={[-2, 2]}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              label={{
                value: 'Momentum (%)',
                angle: 90,
                position: 'insideRight',
                style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 13 }
              }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            
            {/* Zero Reference Line */}
            <ReferenceLine 
              y={0} 
              stroke="#D1D5DB" 
              strokeDasharray="3 3" 
              yAxisId="momentum" 
            />
            
            {/* Questions Line */}
            <Line
              yAxisId="questions"
              type="linear"
              dataKey="questions"
              stroke="#1e40af"
              strokeWidth={1}
              dot={{ fill: '#1e40af', strokeWidth: 1, r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              name="Questions"
            />
            
            {/* Momentum Bars */}
            <Bar
              yAxisId="momentum"
              dataKey="momentum"
              barSize={6}
              name="Momentum"
              strokeWidth={0}
              offset={30} // Increased offset to ensure more space between charts
            >
              {enrichedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.momentum >= 0 ? '#22c55e' : '#ef4444'} 
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
