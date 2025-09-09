"use client"

import { CreatePollForm } from "@/components/polls/create-poll-form"
import withAuth from "@/components/auth/withAuth"

function CreatePollPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create a New Poll</h1>
          <p className="text-muted-foreground">
            Design engaging polls to gather opinions from your community
          </p>
        </div>
        
        <CreatePollForm />
      </div>
    </div>
  )
}

export default withAuth(CreatePollPage)
