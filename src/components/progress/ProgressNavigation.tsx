
import { 
  Home, 
  GraduationCap, 
  BookOpen, 
  BrainCircuit, 
  Info,
  Navigation,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

  return (
    <div className="flex items-center gap-3">
      {/* Collapsible Sidebar Trigger */}
      <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <CollapsibleTrigger className="rounded-lg p-2 hover:bg-gray-100 transition-colors">
          <Navigation className="h-5 w-5 text-blue-500" />
        </CollapsibleTrigger>
      </Collapsible>
      
      <h1 
        className="text-2xl font-bold text-gray-800"
        style={{ fontFamily: '"Dancing Script", cursive' }}
      >
        Academic Arc
      </h1>
      
      {/* Navigation Menu */}
      <NavigationMenu className="ml-6">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink 
              className={navigationMenuTriggerStyle()}
              onClick={() => navigate("/")}
            >
              <Home className="w-4 h-4 mr-2 text-blue-600" />
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink 
              className={navigationMenuTriggerStyle()}
              onClick={() => navigate("/exams")}
            >
              <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
              Exams
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink 
              className={navigationMenuTriggerStyle()}
              onClick={() => navigate("/practice")}
            >
              <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
              Practice
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-blue-50">
              <BrainCircuit className="w-4 h-4 mr-2 text-blue-600" />
              Progress
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-6 no-underline outline-none focus:shadow-md"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Track Your Progress
                      </div>
                      <p className="text-sm leading-tight text-blue-600/90">
                        View detailed statistics about your performance and track your improvement over time.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li onClick={() => setPeriod("daily")}>
                  <NavigationMenuLink asChild>
                    <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600">
                      <div className="text-sm font-medium leading-none">Daily Stats</div>
                      <p className="line-clamp-2 text-sm leading-snug text-blue-600/90">
                        View your performance for today
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li onClick={() => setType("leaderboard")}>
                  <NavigationMenuLink asChild>
                    <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600">
                      <div className="text-sm font-medium leading-none">Leaderboard</div>
                      <p className="line-clamp-2 text-sm leading-snug text-blue-600/90">
                        See how you rank among other students
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink 
              className={navigationMenuTriggerStyle()}
              onClick={() => navigate("/about")}
            >
              <Info className="w-4 h-4 mr-2 text-blue-600" />
              About Us
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
