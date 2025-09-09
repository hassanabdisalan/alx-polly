"use client"
 
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { createPoll } from "@/lib/actions/create-poll"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
 
/**
 * Renders a form for creating a new poll.
 *
 * @returns The create poll form component.
 */
export function CreatePollForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState([{ text: "" }, { text: "" }])
  const [isLoading, setIsLoading] = useState(false)
 
  /**
   * Handles the change event for the option inputs.
   *
   * @param index - The index of the option to update.
   * @param value - The new value of the option.
   */
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index].text = value
    setOptions(newOptions)
  }
 
  /**
   * Adds a new option to the poll.
   */
  const addOption = () => {
    setOptions([...options, { text: "" }])
  }
 
  /**
   * Removes an option from the poll.
   *
   * @param index - The index of the option to remove.
   */
  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }
 
  /**
   * Handles the form submission for creating a new poll.
   *
   * @param e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validOptions = options.map(o => o.text.trim()).filter(Boolean)
    if (!title.trim() || validOptions.length < 2) {
      toast.error("Invalid form", {
        description: "Please provide a title and at least two options.",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create the poll.
      const res = await createPoll({
        title: title.trim(),
        description: description.trim() || undefined,
        options: validOptions,
      } as any)

      if (!res?.success) {
        toast.error("Failed to create poll", {
          description: res?.error || "An unexpected error occurred.",
        })
        setIsLoading(false)
        return
      }

      toast.success("Poll created", {
        description: "Your poll was created successfully.",
      })

      // Redirect to the polls page.
      router.push("/polls")
    } catch (err: any) {
      toast.error("Error", {
        description: err?.message || "Something went wrong.",
      })
    } finally {
      setIsLoading(false)
    }
  }
 
  // Require a non-empty title and at least two non-empty options before enabling submit
  const isValid = title.trim().length > 0 && options.filter(opt => opt.text.trim().length > 0).length >= 2
 
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
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
