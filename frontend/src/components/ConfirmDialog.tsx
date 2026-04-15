import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, description, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', loading, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" style={{ backdropFilter: 'blur(4px)' }} onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div className="mb-5 flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: '#fee2e2' }}>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold" style={{ color: '#111827' }}>{title}</h2>
            {description && <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>{description}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>{cancelLabel}</Button>
          <Button variant="danger" size="sm" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
