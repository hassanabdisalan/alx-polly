"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createPoll } from "@/lib/actions/create-poll"
import { useToast } from "@/components/ui/use-toast"
import { CreatePollData } from "@/types/poll"

export function CreatePollForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<CreatePollData>({
    title: "",
    description: "",
    options: ["", ""]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [expiresAt, setExpiresAt] = useState("")

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData(prev => ({ ...prev, options: newOptions }))
  }

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, ""]
    }))
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, options: newOptions }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Validate form data
      if (!formData.title.trim()) {
        throw new Error("Poll title is required")
      }
      
      const validOptions = formData.options.filter(opt => opt.trim() !== "")
      if (validOptions.length < 2) {
        throw new Error("At least two poll options are required")
      }
      
      const result = await createPoll({
        ...formData,
        options: validOptions,
        expiresAt: expiresAt || undefined
      })
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Your poll has been created.",
        })
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          options: ["", ""]
        })
        setExpiresAt("")
        
        // Redirect to the new poll
        router.push(`/polls/${result.pollId}`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create poll",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
      console.error("Error creating poll:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isValid = formData.title.trim() && 
    formData.options.filter(opt => opt.trim()).length >= 2

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a new poll</CardTitle>
        <CardDescription>
          Create a poll to gather opinions from your community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Poll Title
            </label>
            <Input
              id="title"
              placeholder="Enter poll title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <Input
              id="description"
              placeholder="Enter poll description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="expiresAt" className="text-sm font-medium">
              Expiration Date (Optional)
            </label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Poll Options</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
              >
                Add Option
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required={index < 2}
                  />
                  {index >= 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      <span className="sr-only">Remove</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading ? "Creating..." : "Create Poll"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
