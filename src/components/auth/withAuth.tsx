"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAuth: React.FC<P> = props => {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!user) {
        router.replace("/auth/login")
      }
    }, [user, router])

    if (!user) {
      return null // or a loading spinner
    }

    return <WrappedComponent {...props} />
  }

  return WithAuth
}

export default withAuth
