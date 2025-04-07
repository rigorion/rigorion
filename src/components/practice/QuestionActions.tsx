import { Button } from "@/components/ui/button";
import { Share2, Tag, Bookmark } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuestionActionsProps {
  activeTab: "problem" | "solution" | "quote";
  onTabChange: (tab: "problem" | "solution" | "quote") => void;
}

export const QuestionActions = ({ 
  activeTab,
  onTabChange
}: QuestionActionsProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      {/* Tab Controls */}
      <Tabs 
        value={activeTab} 
        onValueChange={onTabChange} 
        className="mr-auto"
      >
        <TabsList>
          <TabsTrigger value="problem">Problem</TabsTrigger>
          <TabsTrigger value="solution">Solution</TabsTrigger>
          <TabsTrigger value="quote">Quote</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Tag className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Easy</DropdownMenuItem>
            <DropdownMenuItem>Medium</DropdownMenuItem>
            <DropdownMenuItem>Hard</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="ghost" size="icon">
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};