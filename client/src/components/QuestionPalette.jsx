import React from 'react';
import Tooltip from './ui/Tooltip';

const QuestionPalette = ({ total, answers, flagged, current, onSelect }) => {
  const questions = Array.from({ length: total }, (_, i) => i + 1);

  const getStatusLabel = (idx) => {
    if (current === idx) return 'Active Question';
    if (flagged.has(idx)) return 'Flagged for Review';
    if (answers[idx] !== undefined) return 'Answered';
    return 'Unanswered';
  };

  const getButtonClass = (idx) => {
    const isCurrent = current === idx;
    const isAnswered = answers[idx] !== undefined;
    const isFlagged = flagged.has(idx);

    let baseClass = "w-full aspect-square rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center border-2 box-border ";

    if (isCurrent) {
      baseClass += "bg-primary text-white border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900 shadow-md scale-[1.04] z-10 ";
    } else if (isFlagged) {
      baseClass += "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500 shadow-sm ";
    } else if (isAnswered) {
      baseClass += "bg-emerald-600 text-white border-emerald-600 shadow-sm ";
    } else {
      baseClass += "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/60 hover:bg-primary/5 ";
    }

    return baseClass;
  };

  return (
    <div className="bg-cream/60 dark:bg-gray-900/90 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col h-full w-full box-border overflow-hidden">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
        Question Palette ({total})
      </h3>
      
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5 mb-6 overflow-y-auto overflow-x-hidden p-1 flex-1 custom-scrollbar w-full box-border">
        {questions.map((q) => (
          <Tooltip 
            key={q} 
            title={`Question ${q}`} 
            content={getStatusLabel(q)} 
            position="top"
            className="w-full"
          >
            <button
              onClick={() => onSelect(q)}
              className={getButtonClass(q)}
            >
              {q}
            </button>
          </Tooltip>
        ))}
      </div>

      <div className="space-y-2.5 pt-4 border-t border-gray-200 dark:border-gray-800 mt-auto shrink-0 text-xs font-semibold text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-md bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shrink-0" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-md bg-emerald-600 shrink-0" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-md bg-primary ring-2 ring-primary ring-offset-1 shrink-0" />
          <span>Current Question</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-md bg-amber-500/10 border-2 border-amber-500 shrink-0" />
          <span>Flagged for Review</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionPalette;
