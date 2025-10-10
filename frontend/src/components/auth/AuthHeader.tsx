import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <Link href="/" className="inline-flex items-center space-x-2 mb-6">
        <span className="text-3xl">🍳</span>
        <span className="text-2xl font-bold">AI Recipe</span>
      </Link>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
