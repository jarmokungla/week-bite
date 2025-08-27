import Link from 'next/link'
import React from 'react'

interface FeatureCardProps {
  href: string
  title: string
  description: string
  icon: React.ReactNode
  action?: string
}

export default function FeatureCard({ href, title, description, icon, action = 'Open' }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="bg-surface rounded-3xl p-6 shadow-md flex flex-col hover:shadow-lg transition-shadow"
    >
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-4 text-xl font-semibold text-headline">{title}</h3>
      <p className="mt-1 text-sm text-muted flex-1">{description}</p>
      <span className="mt-4 inline-block self-start rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
        {action}
      </span>
    </Link>
  )
}
