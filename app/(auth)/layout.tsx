import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col items-center justify-center">
        <div className="text-center space-y-4 pt-32">
          <h1 className="font-bold text-3xl ">Welcome Back!</h1>
          <p className="text-base">
            Log in or Create account to get back to your dashboard
          </p>
          <div className="flex items-center justify-center">{children}</div>
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-center">
        <Image
          src={"/money.jpg"}
          alt="Money"
          height={1920}
          width={1080}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
