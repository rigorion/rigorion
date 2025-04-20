
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Practice", path: "/practice" },
  { label: "Progress", path: "/progress" },
  { label: "Chat", path: "/chat" },
  { label: "About", path: "/about" },
];

const AppSidebar = () => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[380px] bg-white">
        <nav className="flex flex-col gap-4 mt-8">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start text-lg font-medium transition-colors",
                "hover:bg-slate-100 hover:text-slate-900"
              )}
              onClick={() => {
                navigate(item.path);
              }}
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default AppSidebar;
