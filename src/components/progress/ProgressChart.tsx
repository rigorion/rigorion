
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { format, parseISO } from 'date-fns';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface PerformanceDataPoint {
  date: string;
  attempted: number;
}

interface ProgressChartProps {
  data: PerformanceDataPoint[];
}

// Custom tooltip for better appearance
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium">{`Date: ${label}`}</p>
        <p className="text-purple-600">{`Questions: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const ProgressChart = ({ data = [] }: ProgressChartProps) => {
  // Format the dates for display
  const formattedData = data.map(item => ({
    date: format(new Date(item.date), 'MM/dd'),
    questions: item.attempted
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        barSize={16}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          dy={10}
          tick={{ fill: '#6b7280' }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          dx={-10}
          tick={{ fill: '#6b7280' }}
          label={{ 
            value: 'Questions Attempted', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 12 }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="questions"
          fill="url(#purpleGradient)"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
          animationEasing="ease-out"
        />
        <defs>
          <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#6E59A5" stopOpacity={0.6}/>
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
};
