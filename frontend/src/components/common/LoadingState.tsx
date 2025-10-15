interface LoadingStateProps {
  message?: string;
  children?: React.ReactNode;
}

export function LoadingState({ message, children }: LoadingStateProps) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      {children}
      <p>{message}</p>
    </div>
  );
}
