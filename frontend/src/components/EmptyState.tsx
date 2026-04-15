import { PackageOpen } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title = 'Nenhum registro encontrado', description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: '#f3f4f6' }}>
        <PackageOpen className="h-6 w-6" style={{ color: '#d1d5db' }} />
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{title}</p>
        {description && <p className="mt-0.5 text-xs" style={{ color: 'var(--text-faint)' }}>{description}</p>}
      </div>
      {action}
    </div>
  );
}
