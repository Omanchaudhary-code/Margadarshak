
import { cn } from "@/lib/utils"
import { GraduationLoader } from "./graduation-loader"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  useGraduationLoader?: boolean
}

function Skeleton({
  className,
  useGraduationLoader = false,
  ...props
}: SkeletonProps) {
  if (useGraduationLoader) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)} {...props}>
        <GraduationLoader />
      </div>
    )
  }

  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
