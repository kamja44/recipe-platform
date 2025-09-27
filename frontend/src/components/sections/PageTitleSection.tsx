interface PageTitleSectionProps {
  title: string;
  description: string;
}

export function PageTitleSection({
  title,
  description,
}: PageTitleSectionProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-muted-foreground">{description}</p>
    </div>
  );
}
