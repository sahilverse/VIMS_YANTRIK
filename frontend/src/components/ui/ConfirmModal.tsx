import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onClose
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={!isLoading ? onClose : undefined}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <div className={`p-4 rounded-full mb-6 ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-zinc-50 text-zinc-900'}`}>
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">{title}</h2>
          <p className="text-sm font-medium text-zinc-500 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-12 border-zinc-200 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 h-12 text-white rounded-xl text-sm font-bold transition-all shadow-xl shadow-black/10 cursor-pointer active:scale-[0.98] ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-zinc-950 hover:bg-zinc-800'
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
