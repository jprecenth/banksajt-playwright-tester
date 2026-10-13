import { Header } from "@/components/header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden flex-col font-sans dark:bg-black ">
      <Header/>
      <main className="main-content flex min-h-0 flex-1">
        <div className="sidebar w-max-[30%] flex-1 bg-pink-300 p-8 ">
          <nav className="flex flex-col *:bg-pink-500 *:rounded-4xl *:p-3 *:m-3 *:text-black *:border-3 *:uppercase *:font-bold *:hover:bg-pink-400 *:hover:cursor-pointer *:hover:border-pink-600 text-center *:text-nowrap font-autour">
            <Link
              href={"/login"}>
              Logga In
            </Link>
            <Link
              href={"/register"}>
              Skapa Konto
            </Link>
          </nav>
        </div>
        <div className="content-section w-full">
          <div className="hero-section flex flex-col relative w-full p-40 items-center">
            <h1 className="mb-4 text-2xl text-center">
              Bli medlem hos BankSajt.se och <br/>skapa ett konto redan idag!
            </h1>
            <Link
              className="bg-pink-500 rounded-4xl p-3 border-3 uppercase font-bold hover:bg-pink-400 hover:cursor-pointer hover:border-pink-600 z-10 font-autour"
              href={"/register"}>
              Skapa Konto
            </Link>
            <img
              alt="Piggy Bank Logo"
              src="/logo.png"
              width={300}
              height={300}
              className="absolute left-8 bottom-8 opacity-20 z-1"
            />
          </div>
          <div className="flex p-8 gap-12 bg-pink-100 h-full">
            <div className="flex flex-col">
              <span className="font-bold">
                Title
              </span>
              <span className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </span>
              <span className="font-bold">
                Title
              </span>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </span>
            </div>
            <img
              src="/transfer.png"
              alt="Money exchange hands"
              width={160}
              height={160}
              className="m-10 p-2 h-40 border-4 border-black rounded-3xl bg-pink-400"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
