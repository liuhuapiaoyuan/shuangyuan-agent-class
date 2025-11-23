
import React from 'react';
import { HelpCircle, Sun, Download, Share2, Settings, PenTool, Users, User } from './ui/Icons';

interface HeaderProps {
  onOpenPreparation?: () => void;
  viewMode?: 'teacher' | 'student';
  onSwitchRole?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPreparation, viewMode = 'teacher', onSwitchRole }) => {
  const navItems = ['首页', '学生学习', '教师教学', '听课总结'];
  const activeIndex = 1; // "学生学习"

  // Different header for Student View
  if (viewMode === 'student') {
     return (
      <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-50 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
            <User className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-800">希沃学习中心</span>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={onSwitchRole}
             className="text-xs border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-colors"
           >
             切换回教师端
           </button>
        </div>
      </header>
     );
  }

  // Teacher View
  return (
    <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-50 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Sun className="w-5 h-5" />
          </div>
          希沃课堂智能反馈系统
        </div>
        
        <nav className="flex gap-8 ml-8">
          {navItems.map((item, index) => (
            <button
              key={item}
              className={`relative h-16 px-1 text-sm font-medium transition-colors ${
                index === activeIndex 
                  ? 'text-seewo-green font-bold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item}
              {index === activeIndex && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-seewo-green rounded-t-full"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onSwitchRole}
          className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors text-sm border border-transparent hover:border-gray-200 mr-2"
        >
           <User className="w-4 h-4" />
           学生端预览
        </button>

        <button 
          onClick={onOpenPreparation}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors text-sm font-medium border border-indigo-100 mr-2"
        >
           <PenTool className="w-4 h-4" />
           备课中心
        </button>

        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
           <HelpCircle className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
           <Settings className="w-5 h-5" />
        </button>
        
        <div className="h-6 w-px bg-gray-200 mx-2"></div>
        
        <button className="px-4 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          下载
        </button>
        <button className="px-4 py-1.5 bg-seewo-light border border-seewo-green text-seewo-green rounded text-sm hover:bg-emerald-50 transition-colors font-medium">
          分享
        </button>
      </div>
    </header>
  );
};
