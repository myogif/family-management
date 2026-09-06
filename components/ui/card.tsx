'use client'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className = '', children }: CardProps) {
  return (
    <div className={`p-6 border rounded-lg bg-background ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children }: CardProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ className = '', children }: CardProps) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
}

export function CardDescription({ className = '', children }: CardProps) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
}

export function CardContent({ className = '', children }: CardProps) {
  return <div className={`${className}`}>{children}</div>
}

export function CardFooter({ className = '', children }: CardProps) {
  return <div className={`mt-6 flex gap-2 ${className}`}>{children}</div>
}
