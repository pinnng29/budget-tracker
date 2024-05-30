import { UserButton } from "@clerk/nextjs";
import WelcomeMsg from "./_components/welcome-msg";

export default function Dashboard() {
  return (
    <div className="h-full bg-background">
      <WelcomeMsg />
    </div>
  )
}
