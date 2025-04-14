
import { Home, GraduationCap, BookOpen, BrainCircuit, Info, Navigation, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "react-router-dom";

interface ProgressNavigationProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setPeriod: (period: string) => void;
}

export const ProgressNavigation = ({
  sidebarOpen,
  setSidebarOpen,
  setPeriod
}: ProgressNavigationProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-3">
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
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100">Navigate</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[200px]">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/" className={navigationMenuTriggerStyle() + " justify-start cursor-pointer"}>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/practice" className={navigationMenuTriggerStyle() + " justify-start cursor-pointer"}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Practice</span>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/chat" className={navigationMenuTriggerStyle() + " justify-start cursor-pointer"}>
                      <BrainCircuit className="mr-2 h-4 w-4" />
                      <span>Chat</span>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/about" className={navigationMenuTriggerStyle() + " justify-start cursor-pointer"}>
                      <Info className="mr-2 h-4 w-4" />
                      <span>About</span>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
