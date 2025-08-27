import React from 'react'

export default function Button({ className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primaryDark transition-colors ${className}`}
    />
  )
}
