"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CreatePollForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    options: ["", ""]
  })
  const [isLoading, setIsLoading] = useState(false)

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
    
    // TODO: Implement poll creation logic
    console.log("Creating poll:", formData)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Reset form
      setFormData({
        title: "",
        description: "",
        options: ["", ""]
      })
    }, 1000)
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
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                  {formData.options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !isValid}
          >
            {isLoading ? "Creating poll..." : "Create Poll"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
