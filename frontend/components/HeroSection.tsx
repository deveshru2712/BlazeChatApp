import Link from "next/link";

export default function Hero() {
  return (
    <div className="my-40 w-full h-full relative">
      <main className="max-w-5xl mx-auto flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-slate-700 dark:text-white relative text-center">
        <div className="backdrop-blur-sm bg-white/10 dark:bg-transparent rounded-3xl">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            <span className="animated-warm-gradient-text hover:brightness-110 transition-all duration-300 cursor-pointer">
              Blaze
            </span>{" "}
            <span>Where Every Message Ignites the Conversation.</span>
          </h1>

          <p className="mx-auto text-sm md:text-xl text-slate-800 dark:text-white/90 max-w-2xl mt-4 font-medium leading-relaxed">
            Experience lightning-fast messaging with AI-powered smarts.
            <br className="hidden md:block" />
            Connect effortlessly—no fluff, just meaningful chats that spark and flow.
          </p>

          <div className="mt-8">
            <Link href={"/sign-in"}>
              <button className="text-sm md:text-lg font-semibold cursor-pointer rounded-xl py-3 px-6 text-white bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Get Started 🚀
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
