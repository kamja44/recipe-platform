interface EmptyStateProps {
  message?: string;
  children?: React.ReactNode;
}

export function EmptyState({ message, children }: EmptyStateProps) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      {children && (
        <div className="h-12 w-12 mx-auto mb-4 opacity-50">{children}</div>
      )}
      <p>{message}</p>
    </div>
  );
}
