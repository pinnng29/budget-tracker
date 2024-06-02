import { UserButton } from "@clerk/nextjs";
import WelcomeMsg from "./_components/welcome-msg";
import Overview from "./_components/overview";

export default function Dashboard() {
  return (
    <div className="h-full bg-background">
      <WelcomeMsg />
      <Overview />
    </div>
  )
}
