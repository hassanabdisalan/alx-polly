"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CreatePollData } from "@/types/poll";

export async function createPoll(formData: CreatePollData) {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: "You must be logged in to create a poll" };
    }
    
    const userId = session.user.id;
    
    // Start a transaction to create the poll and its options
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        title: formData.title,
        description: formData.description,
        created_by: userId,
        expires_at: formData.expiresAt || null,
        is_active: true
      })
      .select()
      .single();
    
    if (pollError) {
      console.error("Error creating poll:", pollError);
      return { success: false, error: "Failed to create poll" };
    }
    
    // Create poll options
    const pollOptions = formData.options
      .filter(option => option.trim() !== "") // Filter out empty options
      .map(option => ({
        poll_id: poll.id,
        text: option
      }));
    
    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(pollOptions);
    
    if (optionsError) {
      console.error("Error creating poll options:", optionsError);
      return { success: false, error: "Failed to create poll options" };
    }
    
    return { 
      success: true, 
      pollId: poll.id,
      message: "Poll created successfully" 
    };
  } catch (error) {
    console.error("Error in createPoll:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}