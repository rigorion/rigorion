import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Home, BookOpen, MessageSquare, ShoppingBag, Settings, Info, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const AppSidebar = () => {
  const [isChaptersOpen, setIsChaptersOpen] = useState(false);

  return (
    <SidebarComponent>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Collapsible open={isChaptersOpen} onOpenChange={setIsChaptersOpen}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <BookOpen className="h-4 w-4" />
                  <span>Chapters</span>
                  <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${isChaptersOpen ? "rotate-90" : ""}`} />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/chapters/progress">Progress</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/chat">
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/products">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Products</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/about">
                  <Info className="h-4 w-4" />
                  <span>About Us</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default AppSidebar;