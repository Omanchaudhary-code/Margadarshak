
"use client"

import * as React from "react"
import { GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface GraduationLoaderProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

const GraduationLoader = React.forwardRef<
  HTMLDivElement,
  GraduationLoaderProps
>(({ className, size = "md", showText = true, ...props }, ref) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-3",
        sizeClasses[size],
        className
      )}
      aria-busy="true"
      aria-label="Loading your academic assessment"
      {...props}
    >
      {showText && (
        <span className="font-medium text-slate-700">
          Margadarshak
        </span>
      )}
      
      {/* Animated dots */}
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse-dots-1"></div>
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse-dots-2"></div>
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse-dots-3"></div>
        </div>
      </div>

      {/* Graduation cap icon */}
      <GraduationCap 
        className={cn(
          "text-slate-800 flex-shrink-0",
          iconSizes[size]
        )}
        aria-hidden="true"
      />
    </div>
  )
})
GraduationLoader.displayName = "GraduationLoader"

export { GraduationLoader }
