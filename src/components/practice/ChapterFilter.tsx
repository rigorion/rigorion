
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen } from "lucide-react";

interface ChapterFilterProps {
  chapters: string[];
  selectedChapter: string;
  onChapterChange: (chapter: string) => void;
  className?: string;
}

export const ChapterFilter = ({ 
  chapters, 
  selectedChapter, 
  onChapterChange,
  className = ""
}: ChapterFilterProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <BookOpen className="h-4 w-4 text-gray-500" />
      <Select value={selectedChapter} onValueChange={onChapterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select chapter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All Chapters">All Chapters</SelectItem>
          {chapters.map((chapter) => (
            <SelectItem key={chapter} value={chapter}>
              {chapter}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
