
import { Trophy, ChevronRight, Star } from "lucide-react";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

import { createClient } from '@supabase/supabase-js';

// Create the Supabase client (make sure the env vars are set properly)
const supabase = createClient(
 'https://eantvimmgdmxzwrjwrop.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhbnR2aW1tZ2RteHp3cmp3cm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTk0OTEsImV4cCI6MjA1OTYzNTQ5MX0.A4T0RL_luqzFIPSikCllFpNJtwxcVaLiDm_BCBlRcu8'
);

// Call the Edge Function
const { data, error } = await supabase.functions.invoke('get-progress', {
  body: {
    userId: '55fb126c-109d-4c10-96af-18edc09a81c7',   // replace this with actual userId
    period: 'weekly'          // optional if your function supports it
  }
});

if (error) {
  console.error('Edge function error:', error);
} else {
  console.log('User progress:', data);
}






interface LeaderboardUser {
  rank: number;
  name: string;
  problems: number;
  accuracy: string;
  score: number;
  isCurrentUser?: boolean;
  trend: number;
}

interface LeaderboardTableProps {
  users: LeaderboardUser[];
}

export const LeaderboardTable = ({ users }: LeaderboardTableProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Leaderboard</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-blue-50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-blue-800">Rank</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-blue-800">User</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-blue-800">Problems</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-blue-800">Accuracy</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-blue-800">Projected Score</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-blue-800">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow 
                key={index} 
                className={`transition-colors hover:bg-blue-50/50 ${
                  user.isCurrentUser ? "bg-blue-100/50 font-medium" : ""
                }`}
              >
                <TableCell className="border-t px-4 py-3">
                  <div className="flex items-center">
                    <span className={`font-bold ${
                      user.rank === 1 ? "text-amber-500" :
                      user.rank === 2 ? "text-gray-500" :
                      user.rank === 3 ? "text-amber-700" : ""
                    }`}>
                      {user.rank}
                    </span>
                    {user.rank <= 3 && (
                      <Trophy className={`ml-2 h-4 w-4 ${
                        user.rank === 1 ? "text-amber-500 fill-amber-500" :
                        user.rank === 2 ? "text-gray-500 fill-gray-500" :
                        user.rank === 3 ? "text-amber-700 fill-amber-700" : ""
                      }`} />
                    )}
                  </div>
                </TableCell>
                <TableCell className="border-t px-4 py-3">{user.name}</TableCell>
                <TableCell className="border-t px-4 py-3">{user.problems}</TableCell>
                <TableCell className="border-t px-4 py-3">{user.accuracy}</TableCell>
                <TableCell className="border-t px-4 py-3">
                  <div className="flex items-center">
                    {user.score}
                    {user.rank <= 3 && (
                      <Star className="ml-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="border-t px-4 py-3">
                  <div className={`flex items-center ${
                    user.trend > 0 ? "text-emerald-500" : 
                    user.trend < 0 ? "text-rose-500" : "text-gray-500"
                  }`}>
                    {user.trend > 0 && "+"}
                    {user.trend}%
                    {user.trend !== 0 && (
                      <ChevronRight 
                        className={`h-4 w-4 ml-1 ${
                          user.trend > 0 ? "rotate-90" : "rotate-270"
                        }`}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
