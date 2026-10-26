
import Image from "next/image";

export default function SplashScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#061A3A]">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/AClogo.png"
          alt="Smart AC Logo"
          width={160}
          height={160}
          priority
        />

        <h1 className="mt-6 text-4xl font-bold text-white">
          Smart <span className="text-cyan-400">AC</span>
        </h1>

        <p className="mt-3 text-sm text-gray-300">
          Save Energy • Stay Comfortable
        </p>
      </div>
    </main>
  );
}
