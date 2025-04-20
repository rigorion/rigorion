
import { Home, GraduationCap, BookOpen, BrainCircuit, Info, Navigation, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

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
  
  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Practice", path: "/practice" },
    { icon: BrainCircuit, label: "Chat", path: "/chat" },
    { icon: Info, label: "About", path: "/about" },
  ];
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };
  
  return (
    <div className="flex items-center gap-3">
      {/* Navigation Drawer */}
      <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <DrawerTrigger className="rounded-lg p-2 hover:bg-gray-100 transition-colors">
          <Navigation className="h-5 w-5 text-blue-500" />
        </DrawerTrigger>
        <DrawerContent className="h-[60vh] bg-white">
          <nav className="flex flex-col gap-4 p-6">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start text-lg font-medium transition-colors hover:bg-slate-100"
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </DrawerContent>
      </Drawer>
      
      <h1 className="text-2xl font-bold text-gray-800" style={{
        fontFamily: '"Dancing Script", cursive'
      }}>
        Academic Arc
      </h1>
      
      {/* Navigation Menu */}
      <NavigationMenu className="ml-6 hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100">Navigate</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[200px]">
                {navigationItems.map((item) => (
                  <li key={item.path}>
                    <NavigationMenuLink asChild>
                      <Link to={item.path} className={navigationMenuTriggerStyle() + " justify-start cursor-pointer"}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
