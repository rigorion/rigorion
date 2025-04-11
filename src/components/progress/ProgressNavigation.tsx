import { Home, GraduationCap, BookOpen, BrainCircuit, Info, Navigation, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
interface ProgressNavigationProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setPeriod: (period: string) => void;
  setType: (type: string) => void;
}
export const ProgressNavigation = ({
  sidebarOpen,
  setSidebarOpen,
  setPeriod,
  setType
}: ProgressNavigationProps) => {
  const navigate = useNavigate();
  return <div className="flex items-center gap-3">
      {/* Collapsible Sidebar Trigger */}
      <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <CollapsibleTrigger className="rounded-lg p-2 hover:bg-gray-100 transition-colors">
          <Navigation className="h-5 w-5 text-blue-500" />
        </CollapsibleTrigger>
      </Collapsible>
      
      <h1 className="text-2xl font-bold text-gray-800" style={{
      fontFamily: '"Dancing Script", cursive'
    }}>
        Academic Arc
      </h1>
      
      {/* Navigation Menu */}
      <NavigationMenu className="ml-6">
        
      </NavigationMenu>
    </div>;
};