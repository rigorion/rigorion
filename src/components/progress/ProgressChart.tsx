
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, TooltipProps, Bar, BarChart } from 'recharts';
import { format } from 'date-fns';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { useState } from 'react';

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
        <p className="font-medium text-gray-600 mb-2">{format(new Date(label), 'MMM dd')}</p>
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
  const [isLineChart, setIsLineChart] = useState(true);
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

  const renderChart = () => {
    if (isLineChart) {
      return (
        <LineChart
          data={enrichedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E5E5" opacity={0.6} />
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
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="questions"
            strokeWidth={2}
            stroke="#9CA3AF"
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
      );
    }

    return (
      <BarChart
        data={enrichedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E5E5" opacity={0.6} />
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
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="questions"
          fill="url(#barGradient)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E5E7EB" />
            <stop offset="100%" stopColor="#F3F4F6" />
          </linearGradient>
        </defs>
      </BarChart>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Daily Questions Progress</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">
            Avg: {avgQuestions} questions/day
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsLineChart(!isLineChart)}
            className="h-8 w-8"
          >
            {isLineChart ? <BarChart3 className="h-4 w-4" /> : <LineChartIcon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
