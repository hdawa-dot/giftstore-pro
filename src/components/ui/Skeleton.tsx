import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-dark-700',
        className,
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-1">
          {[1,2,3].map(i => <Skeleton key={i} className="h-8 w-16 rounded-full" />)}
        </div>
        <Skeleton className="h-10 w-full rounded-xl mt-2" />
      </div>
    </div>
  );
}
