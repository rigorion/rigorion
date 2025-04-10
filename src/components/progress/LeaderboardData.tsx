
import { LeaderboardTable } from "./LeaderboardTable";

export const LeaderboardData = () => {
  const leaderboardUsers = [
    { rank: 1, name: "Alex Zhang", problems: 456, accuracy: "94%", score: 98, trend: +3 },
    { rank: 2, name: "Maria Rodriguez", problems: 421, accuracy: "92%", score: 96, trend: 0 },
    { rank: 3, name: "David Kim", problems: 398, accuracy: "91%", score: 95, trend: +1 },
    { rank: 4, name: "Jessica Taylor", problems: 387, accuracy: "89%", score: 93, trend: -2 },
    { rank: 5, name: "Raj Patel", problems: 365, accuracy: "88%", score: 91, trend: +5 },
    { rank: 6, name: "Sophie Chen", problems: 342, accuracy: "87%", score: 90, trend: -1 },
    { rank: 7, name: "James Wilson", problems: 321, accuracy: "85%", score: 89, trend: 0 },
    { rank: 8, name: "Emma Johnson", problems: 310, accuracy: "84%", score: 88, trend: +2 },
    { rank: 9, name: "Michael Brown", problems: 298, accuracy: "82%", score: 86, trend: -3 },
    { rank: 10, name: "Current User", problems: 248, accuracy: "84%", score: 92, isCurrentUser: true, trend: +4 },
  ];

  return <LeaderboardTable users={leaderboardUsers} />;
};
