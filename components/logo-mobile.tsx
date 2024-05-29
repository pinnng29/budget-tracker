import Link from "next/link";
import Image from "next/image";

export default function LogoMobile() {
  return (
    <Link href={"/"}>
      <div className="flex items-center">
        <Image
          src={"/logo.svg"}
          alt="Logo"
          height={40}
          width={40}
        />
        <p className="text-2xl font-semibold ml-2.5">
          Budget
          <span className="ml-1 rounded-md bg-gradient-to-br from-violet-400 to-cyan-500 p-1 text-foreground">
            Tracker
          </span>
        </p>
      </div>
    </Link>
  );
}
