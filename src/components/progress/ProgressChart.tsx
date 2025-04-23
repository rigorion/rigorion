import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, TooltipProps, Bar, BarChart, Cell, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { motion } from 'framer-motion';

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
  const lastFifteenData = data.slice(-15);
  
  const enrichedData = lastFifteenData.map((item, index) => {
    const prevAttempted = index > 0 ? lastFifteenData[index - 1].attempted : item.attempted;
    const momentum = prevAttempted === 0 ? 0 : 
      ((item.attempted - prevAttempted) / prevAttempted * 100);
    
    const cappedMomentum = Math.max(Math.min(Number(momentum.toFixed(1)), 1.5), -1.5);
    
    return {
      date: format(new Date(item.date), 'MMM dd'),
      questions: item.attempted,
      momentum: cappedMomentum
    };
  });

  const minQuestions = Math.min(...enrichedData.map(d => d.questions));
  const minYAxis = Math.min(minQuestions * 0.8, 0);
  const avgQuestions = Math.round(lastFifteenData.reduce((acc, curr) => acc + curr.attempted, 0) / lastFifteenData.length);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex justify-end items-center mb-4">
        <span className="text-sm font-medium text-gray-600">
          Avg: {avgQuestions} questions/day
        </span>
      </div>

      <div className="w-full space-y-4">
        {/* Questions Chart - 70% of height */}
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="linear"
                dataKey="questions"
                stroke="#1e40af"
                strokeWidth={2}
                dot={{ fill: '#1e40af', strokeWidth: 1, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                name="Questions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Momentum Chart - 30% of height */}
        <div className="w-full h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={enrichedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" opacity={0.4} />
              <YAxis
                axisLine={{ stroke: '#E5E5E5' }}
                tickLine={false}
                dx={10}
                domain={[-1.5, 1.5]}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                label={{
                  value: 'Momentum (%)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 13 }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#D1D5DB" strokeDasharray="3 3" />
              <Bar
                dataKey="momentum"
                barSize={5}
                name="Momentum"
                radius={[2, 2, 0, 0]}
                label={({x, y, value}) => {
                  if (value >= 0) {
                    return (
                      <text
                        x={x}
                        y={y - 10}
                        fill="#22c55e"
                        textAnchor="middle"
                        fontSize="11"
                      >
                        {`${Math.abs(Number(value)).toFixed(1)}%`}
                      </text>
                    );
                  }
                  return null;
                }}
              >
                {enrichedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.momentum >= 0 ? '#22c55e' : '#ef4444'}
                    strokeWidth={0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
