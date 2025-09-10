"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CreatePollData } from "@/types/poll";
+import { revalidatePath } from "next/cache";

/**
 * Server Action: createPoll
 *
 * Creates a new poll and its options for the currently authenticated user.
 * Why: Performing the mutation on the server ensures credentials (cookies) are used securely
 * with the Supabase service while keeping client-side code minimal and tamper-resistant.
 *
 * Behavior:
 * - Reads the session from request cookies
 * - Validates that a user is authenticated
 * - Inserts the poll and then the associated options (filtering empty values)
 * - Returns a success flag, created poll id, and a human-friendly message or error
 *
 * Edge cases:
 * - If the user is not signed in, it returns a handled error instead of throwing
 * - Empty/whitespace-only options are ignored to avoid invalid rows
 * - If option insertion fails, a descriptive error is returned (poll is still created)
 */
export async function createPoll(formData: CreatePollData) {
  // Read the cookie store via Next.js 15 async headers API to build a server client
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  try {
    // Get the current user from the session stored in cookies
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: "You must be logged in to create a poll" };
    }
    
    const userId = session.user.id;
    
    // Insert the poll (title/description validated on client; DB constraints should enforce non-null title)
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
    
    // Map non-empty options to rows for bulk insert
    const pollOptions = formData.options
      .filter(option => option.trim() !== "")
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
    
+    // Invalidate the cached polls listing so the new poll appears immediately
+    revalidatePath("/polls");
+
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