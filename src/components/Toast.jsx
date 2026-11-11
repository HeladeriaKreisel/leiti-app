import React from 'react';

export default function Toast({ toast, onClose }) {
  if (!toast || !toast.visible) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0 opacity-100">
      <div className={`flex items-center gap-space-md px-space-xl py-space-md rounded-xl shadow-lg border ${
        isError 
          ? 'bg-error-container text-on-error-container border-error/20' 
          : 'bg-primary text-on-primary border-primary/20'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isError ? 'bg-error text-white' : 'bg-primary-container text-on-primary-container'
        }`}>
          <span className="material-symbols-outlined text-[20px]">
            {isError ? 'warning' : 'check_circle'}
          </span>
        </div>
        <div className="flex flex-col pr-space-md">
          <span className="font-label-lg text-label-lg font-bold">{toast.title}</span>
          <span className="font-body-md text-body-md opacity-90">{toast.message}</span>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 rounded-lg hover:bg-black/10 transition-colors ml-auto"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}
