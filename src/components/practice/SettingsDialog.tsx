
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
import { Star } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: {
    fontFamily: string;
    fontSize: number;
    colorStyle: 'plain';
    textColor?: string;
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

const SettingsDialog = ({
  open,
  onOpenChange,
  settings,
  onApply,
}: SettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px] bg-white border-none p-3 shadow-md rounded-lg">
        <DialogHeader className="mb-2 pb-1 border-b">
          <DialogTitle className="flex items-center text-sm font-medium text-gray-800">
            <Star className="mr-2 h-4 w-4 text-amber-500" fill="#F59E0B" />
            Text Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-3 py-1">
          {/* Font Family Selection */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-700">Font</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(v) => onApply("fontFamily", v)}
            >
              <SelectTrigger className="w-full h-8 text-xs bg-white">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent className="max-h-[180px] bg-white">
                {FONT_OPTIONS.map((font) => (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    className={cn("text-xs", font.class)}
                  >
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size Slider */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <Label className="text-xs font-medium text-gray-700">Size</Label>
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
          </div>

          {/* Text Color */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-700">Text Color</Label>
            <div className="flex">
              <Input
                type="color"
                value={settings.textColor || '#374151'}
                onChange={(e) => onApply("textColor", e.target.value)}
                className="h-8 w-full cursor-pointer p-0"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-1 p-2 rounded-md border border-gray-100 bg-gray-50">
            <div 
              className={cn(
                "p-2 rounded-md",
                `font-${settings.fontFamily}`
              )}
              style={{
                fontSize: `${settings.fontSize}px`,
                color: settings.textColor || '#374151'
              }}
            >
              Sample text
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
