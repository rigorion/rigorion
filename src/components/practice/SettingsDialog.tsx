
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Paintbrush, Star } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: {
    fontFamily: string;
    fontSize: number;
    colorStyle: 'gradient' | 'plain' | 'custom-gradient';
    gradientStart?: string;
    gradientEnd?: string;
  };
  onApply: (key: string, value: string | number) => void;
}

const FONT_OPTIONS = [
  { value: "inter", label: "Inter", class: "font-sans" },
  { value: "roboto", label: "Roboto", class: "font-roboto" },
  { value: "open-sans", label: "Open Sans", class: "font-open-sans" },
  { value: "comic-sans", label: "Comic Sans", class: "font-comic-sans" },
  { value: "courier-new", label: "Courier New", class: "font-mono" },
  { value: "poppins", label: "Poppins", class: "font-poppins" },
  { value: "merriweather", label: "Merriweather", class: "font-serif" },
  { value: "dancing-script", label: "Dancing Script", class: "font-dancing-script" },
  { value: "ubuntu", label: "Ubuntu", class: "font-ubuntu" }
];

const COLOR_STYLES = [
  { value: "plain", label: "Solid Color" },
  { value: "gradient", label: "Default Gradient" },
  { value: "custom-gradient", label: "Custom Gradient" }
];

const SettingsDialog = ({
  open,
  onOpenChange,
  settings,
  onApply,
}: SettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl font-bold tracking-tight">
            <Star 
              className="mr-2 h-6 w-6 text-amber-500" 
              fill="url(#dialogStarGradient)"
              stroke="url(#dialogStarGradient)"
            />
            Display Settings
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Customize typography and visual appearance
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Font Family Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Font Family</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(v) => onApply("fontFamily", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {FONT_OPTIONS.map((font) => (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    className={cn("text-base", font.class)}
                  >
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size Slider */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label className="text-sm font-medium">Font Size</Label>
              <span className="text-sm text-muted-foreground">
                {settings.fontSize}px
              </span>
            </div>
            <Slider
              min={10}
              max={24}
              step={1}
              value={[settings.fontSize]}
              onValueChange={([value]) => onApply("fontSize", value)}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10px</span>
              <span>24px</span>
            </div>
          </div>

          {/* Color Style Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Color Style</Label>
              <Select
                value={settings.colorStyle}
                onValueChange={(v) => onApply("colorStyle", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_STYLES.map((style) => (
                    <SelectItem 
                      key={style.value} 
                      value={style.value}
                    >
                      <div className="flex items-center gap-2">
                        {style.value === 'custom-gradient' ? (
                          <Paintbrush className="h-4 w-4" />
                        ) : (
                          <div className={cn(
                            "h-4 w-4 rounded-full",
                            style.value === 'gradient' 
                              ? "bg-gradient-to-r from-blue-400 to-purple-500"
                              : "bg-foreground"
                          )}/>
                        )}
                        {style.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Gradient Picker */}
            {settings.colorStyle === 'custom-gradient' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <Label className="text-sm">Start Color</Label>
                  <div className="relative">
                    <Input
                      type="color"
                      value={settings.gradientStart || '#4f46e5'}
                      onChange={(e) => onApply("gradientStart", e.target.value)}
                      className="h-10 w-full cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">End Color</Label>
                  <div className="relative">
                    <Input
                      type="color"
                      value={settings.gradientEnd || '#ec4899'}
                      onChange={(e) => onApply("gradientEnd", e.target.value)}
                      className="h-10 w-full cursor-pointer"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Preview */}
            <div className="mt-4 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <div 
                className={cn(
                  "p-3 rounded-md",
                  settings.colorStyle === 'gradient' && "bg-gradient-to-r from-blue-400 to-purple-500 text-white",
                  settings.colorStyle === 'custom-gradient' && "text-white",
                  `font-${settings.fontFamily}`
                )}
                style={{
                  fontSize: `${settings.fontSize}px`,
                  ...(settings.colorStyle === 'custom-gradient' ? {
                    background: `linear-gradient(to right, ${settings.gradientStart}, ${settings.gradientEnd})`
                  } : {})
                }}
              >
                Sample text with current settings
              </div>
            </div>
          </div>
        </div>

        {/* SVG Gradient definition */}
        <svg className="absolute w-0 h-0">
          <defs>
            <linearGradient id="dialogStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#D97706', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#B45309', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
