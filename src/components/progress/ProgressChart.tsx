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
    const questions = payload[0].value as number;
    const momentum = payload[0].payload.momentum as number;
    
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-medium text-gray-600 mb-2">{`Date: ${label}`}</p>
        <p className="text-sm">Questions: {questions}</p>
        <p 
          className="text-sm"
          style={{ color: momentum >= 0 ? '#22c55e' : '#ef4444' }}
        >
          Momentum: {Math.abs(momentum).toFixed(1)}%
        </p>
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Daily Questions Progress</h3>
        <span className="text-sm font-medium text-gray-600">
          Avg: {avgQuestions} questions/day
        </span>
      </div>

      <div className="w-full h-[400px]">
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
            <Line
              type="linear"
              dataKey="questions"
              strokeWidth={2}
              dot={(props) => {
                const momentum = props.payload.momentum;
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill={momentum >= 0 ? '#22c55e' : '#ef4444'}
                    stroke="white"
                    strokeWidth={1}
                  />
                );
              }}
              activeDot={(props) => {
                const momentum = props.payload.momentum;
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={6}
                    fill={momentum >= 0 ? '#22c55e' : '#ef4444'}
                    stroke="white"
                    strokeWidth={2}
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
