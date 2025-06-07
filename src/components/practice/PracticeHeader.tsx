
import React, { useState } from 'react';
import { Menu, X, Target, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { useQuestions } from '@/contexts/QuestionsContext';
import { getUniqueChapters, getUniqueModules } from '@/utils/mapQuestion';
import ModulesDialog from './ModulesDialog';

interface PracticeHeaderProps {
  onToggleSidebar: () => void;
  onOpenObjective: () => void;
  onOpenMode: () => void;
  mode: "timer" | "level" | "manual" | "pomodoro" | "exam";
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onFilterChange: (filters: { chapter?: string; module?: string; exam?: number }) => void;
}

const PracticeHeader: React.FC<PracticeHeaderProps> = ({
  onToggleSidebar,
  onOpenObjective,
  onOpenMode,
  mode,
  sidebarOpen,
  setSidebarOpen,
  onFilterChange,
}) => {
  const { isDarkMode } = useTheme();
  const { questions } = useQuestions();
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<number | null>(null);

  const uniqueChapters = getUniqueChapters(questions);
  const uniqueModules = getUniqueModules(questions);

  const handleChapterChange = (chapter: string) => {
    setSelectedChapter(chapter);
    onFilterChange({ 
      chapter: chapter === 'all' ? undefined : chapter.match(/Chapter (\d+)/)?.[1], 
      module: selectedModule === 'all' ? undefined : selectedModule,
      exam: selectedExam || undefined
    });
  };

  const handleModuleChange = (module: string) => {
    setSelectedModule(module);
    onFilterChange({ 
      chapter: selectedChapter === 'all' ? undefined : selectedChapter.match(/Chapter (\d+)/)?.[1], 
      module: module === 'all' ? undefined : module,
      exam: selectedExam || undefined
    });
  };

  const handleExamFilterChange = (filters: { exam?: number }) => {
    setSelectedExam(filters.exam || null);
    onFilterChange({
      chapter: selectedChapter === 'all' ? undefined : selectedChapter.match(/Chapter (\d+)/)?.[1],
      module: selectedModule === 'all' ? undefined : selectedModule,
      exam: filters.exam
    });
  };

  const clearAllFilters = () => {
    setSelectedChapter('all');
    setSelectedModule('all');
    setSelectedExam(null);
    onFilterChange({});
  };

  const hasActiveFilters = selectedChapter !== 'all' || selectedModule !== 'all' || selectedExam !== null;

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between px-4 py-2 h-14">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className={`p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            {sidebarOpen ? (
              <X className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`} />
            ) : (
              <Menu className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`} />
            )}
          </Button>

          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-green-400' : 'text-gray-900'}`}>
            Practice
          </h1>
        </div>

        {/* Center Section - Filters */}
        <div className="flex items-center gap-2">
          {/* Chapter Filter */}
          <Select value={selectedChapter} onValueChange={handleChapterChange}>
            <SelectTrigger className={`w-32 h-8 text-xs ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <SelectValue placeholder="Chapter" />
            </SelectTrigger>
            <SelectContent className={isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}>
              <SelectItem value="all">All Chapters</SelectItem>
              {uniqueChapters.map((chapter) => (
                <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Module Filter */}
          <Select value={selectedModule} onValueChange={handleModuleChange}>
            <SelectTrigger className={`w-32 h-8 text-xs ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent className={isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}>
              <SelectItem value="all">All Modules</SelectItem>
              {uniqueModules.map((module) => (
                <SelectItem key={module} value={module}>{module}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className={`h-8 px-2 text-xs ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-400 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <ModulesDialog onFilterChange={handleExamFilterChange} />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenObjective}
            className={`rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <Target className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-blue-500'}`} />
            <span className={isDarkMode ? 'text-green-400' : 'text-gray-700'}>Goals</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenMode}
            className={`rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <Clock className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-blue-500'}`} />
            <span className={isDarkMode ? 'text-green-400' : 'text-gray-700'}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PracticeHeader;
