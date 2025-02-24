import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary/80" />
    </div>
  );
}