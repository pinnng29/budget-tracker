import Navbar from "@/components/navbar"


export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="px-3 lg:px-14">
        {children}
      </main>
    </>
  )
}
