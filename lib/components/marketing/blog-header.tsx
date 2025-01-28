import { Badge } from "@/lib/components/ui/badge";
import { cn } from "@/lib/utils";
interface BlogHeaderProps {
  title: string;
  description?: string;
  created?: string;
  tags?: string[];
  className?: string;
}

export function BlogHeader({
  title,
  description,
  created,
  tags,
  className,
}: BlogHeaderProps) {
  return (
    <div className={cn("mx-auto mb-16", className)}>
      <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-lg/8 text-gray-600">{description}</p>
      )}
      {created && <p className="mt-2 text-sm text-gray-500">{created}</p>}
      {tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
