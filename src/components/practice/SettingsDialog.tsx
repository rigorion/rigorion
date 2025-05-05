
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
import { Paintbrush } from "lucide-react";

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
          <DialogTitle className="text-2xl font-bold tracking-tight">
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
            />
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
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
