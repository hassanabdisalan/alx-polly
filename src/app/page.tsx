import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the polls dashboard
  redirect("/polls");
}
