import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  children?: React.ReactNode;
  icon?: LucideIcon;
  title?: string;
  description?: string;
}

export function EmptyState({
  message,
  children,
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      {/* 새로운 방식: icon prop 사용 */}
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className="h-12 w-12 opacity-50" />
        </div>
      )}

      {/* 기존 방식: children 사용 (하위 호환성) */}
      {!Icon && children && (
        <div className="h-12 w-12 mx-auto mb-4 opacity-50">{children}</div>
      )}

      {/* 새로운 방식: title/description */}
      {title && <p className="font-semibold mb-1">{title}</p>}
      {description && <p className="text-sm">{description}</p>}

      {/* 기존 방식: message (하위 호환성) */}
      {!title && !description && message && <p>{message}</p>}
    </div>
  );
}
