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
      <div className="bg-mono-bg p-3 border border-mono-border shadow-md rounded-md">
        <p className="font-medium text-mono-text">{`Date: ${label}`}</p>
        <p className="text-mono-accent">{`Questions: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const ProgressChart = ({ data = [] }: ProgressChartProps) => {
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
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" opacity={0.3} />
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          dy={10}
          tick={{ fill: '#717171' }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          dx={-10}
          tick={{ fill: '#717171' }}
          label={{ 
            value: 'Questions Attempted', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: '#717171', fontSize: 12 }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="questions"
          fill="url(#monoGradient)"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
          animationEasing="ease-out"
        />
        <defs>
          <linearGradient id="monoGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#717171" stopOpacity={0.6}/>
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
};
