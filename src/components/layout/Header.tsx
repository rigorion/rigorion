import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Zap, ArrowUp, Menu, Home, BookOpen, MessageSquare, ShoppingBag, Info } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
const Header = () => {
  const {
    toggleSidebar
  } = useSidebar();
  const [rank] = useState(150); // This would come from your ranking system
  const [rankTrend] = useState<"up" | "down">("up"); // This would be dynamic

  return <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Button variant="ghost" size="icon" className="mr-4" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="mr-4 hidden md:flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Academic Arc</span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          
        </div>
      </div>
    </header>;
};
export default Header;