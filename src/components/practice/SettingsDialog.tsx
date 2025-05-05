
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
      <DialogContent className="sm:max-w-[400px] bg-white border-none p-4 shadow-lg rounded-lg">
        <DialogHeader className="mb-2 pb-2 border-b">
          <DialogTitle className="flex items-center text-lg font-medium text-gray-800">
            <Star className="mr-2 h-5 w-5 text-amber-500" fill="#F59E0B" />
            Display Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-2">
          {/* Font Family Selection */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Font Family</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(v) => onApply("fontFamily", v)}
            >
              <SelectTrigger className="w-full h-9 text-sm bg-white">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] bg-white">
                {FONT_OPTIONS.map((font) => (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    className={cn("text-sm", font.class)}
                  >
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size Slider */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-sm font-medium text-gray-700">Font Size</Label>
              <span className="text-xs text-gray-500">
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
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Color Style</Label>
              <Select
                value={settings.colorStyle}
                onValueChange={(v) => onApply("colorStyle", v)}
              >
                <SelectTrigger className="w-full h-9 text-sm bg-white">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {COLOR_STYLES.map((style) => (
                    <SelectItem 
                      key={style.value} 
                      value={style.value}
                      className="text-sm"
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
                className="grid grid-cols-2 gap-3"
              >
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-600">Start Color</Label>
                  <div className="relative">
                    <Input
                      type="color"
                      value={settings.gradientStart || '#4f46e5'}
                      onChange={(e) => onApply("gradientStart", e.target.value)}
                      className="h-8 w-full cursor-pointer p-0"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-600">End Color</Label>
                  <div className="relative">
                    <Input
                      type="color"
                      value={settings.gradientEnd || '#ec4899'}
                      onChange={(e) => onApply("gradientEnd", e.target.value)}
                      className="h-8 w-full cursor-pointer p-0"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Preview */}
            <div className="mt-2 p-3 rounded-md border border-gray-100 bg-gray-50">
              <h3 className="text-xs font-medium mb-2 text-gray-600">Preview</h3>
              <div 
                className={cn(
                  "p-2 rounded-md",
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
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
