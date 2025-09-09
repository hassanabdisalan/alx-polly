"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

/**
 * A higher-order component that checks if a user is authenticated before rendering the wrapped component.
 * If the user is not authenticated, it redirects them to the login page.
 *
 * @param WrappedComponent - The component to wrap with authentication.
 * @returns The wrapped component with authentication.
 */
const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAuth: React.FC<P> = props => {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
      // If the user is not authenticated, redirect to the login page.
      if (!user) {
        router.replace("/auth/login")
      }
    }, [user, router])

    // If the user is not authenticated, don't render the component.
    if (!user) {
      return null // or a loading spinner
    }

    // If the user is authenticated, render the component.
    return <WrappedComponent {...props} />
  }

  return WithAuth
}

export default withAuth
