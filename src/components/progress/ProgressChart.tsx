import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const generateLast10DaysData = () => {
  return Array.from({ length: 10 }).map((_, index) => {
    const date = subDays(new Date(), 9 - index);
    return {
      date: format(date, 'MM/dd'),
      questions: Math.floor(Math.random() * 30) + 10,
    };
  });
};

const data = generateLast10DaysData();

export const ProgressChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barSize={16}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          dx={-10}
          label={{ 
            value: 'Questions Attempted', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }}
        />
        <Tooltip />
        <Bar
          dataKey="questions"
          fill="url(#blueGradient)"
          radius={[4, 4, 0, 0]}
        />
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.4}/>
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
};