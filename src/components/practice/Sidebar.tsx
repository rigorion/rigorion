import { Home, ChartBar, MessageSquare, ShoppingBag, Settings, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SidebarProps {
  onClose: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ChartBar, label: "Progress", path: "/progress" },
    { icon: MessageSquare, label: "Chat", path: "/chat" },
    { icon: ShoppingBag, label: "Products", path: "/products" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Info, label: "About Us", path: "/about" },
  ];

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      className="fixed left-0 top-0 h-full w-64 bg-white border-r shadow-lg z-50"
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="font-semibold">Menu</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="p-4">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.path}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </motion.div>
  );
};