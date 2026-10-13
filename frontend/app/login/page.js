"use client";
import { Header } from "@/components/header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";

export default function Login() {
    const router = useRouter();
    const [JWTtoken, setJWTtoken] = useContext(AuthContext)
    async function handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);


        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const result = await response.json();

        if (response.ok) {
            setJWTtoken(result.token);
            console.log("Signed in successfully!");
            router.push("/account")
        } else {
            console.log(result.error);
        }
    }
    return (
        <div className="flex h-screen overflow-hidden flex-col font-sans dark:bg-black ">
            <Header/>
            <main className="main-content flex min-h-0 flex-1">
                <div className="sidebar w-max-[30%] flex-1 bg-pink-300 p-8 ">
                    <div className="flex flex-col *:bg-pink-500 *:rounded-4xl *:p-3 *:m-3 *:text-black *:border-3 *:uppercase *:font-bold *:hover:bg-pink-400 *:hover:cursor-pointer *:hover:border-pink-600 text-center *:text-nowrap font-autour">
                        <Link
                            href={"/"}>
                            Startsida
                        </Link>
                        <Link
                            href={"/login"}>
                            Logga In
                        </Link>
                        <Link
                            href={"/register"}>
                            Skapa Konto
                        </Link>
                    </div>
                </div>
                <div className="content-section w-full">
                    <div className="hero-section flex flex-col relative w-full h-full p-8 items-center">
                        <p className="mb-5 *:p-1 text-md text-gray-600 self-start">
                            <Link
                                href={"/"}
                                className="underline hover:cursor-pointer">
                                Hem
                            </Link>
                            <span>/</span>
                            <span>
                                Logga in
                            </span>
                        </p>
                        <form
                            className="w-180 flex flex-col relative h-full p-40 items-center"
                            onSubmit={handleLogin}
                        >
                            <span className="text-2xl mb-8">
                                Logga in på ditt BankSajt-konto
                            </span>
                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="username"
                                    className="font-bold uppercase"
                                >
                                    Användarnamn:
                                </label>
                                <input
                                    type="text"
                                    placeholder="Användarnamn"
                                    id="username"
                                    name="username"
                                    className="mb-4 p-3 pl-5 border-3 rounded-4xl z-10"
                                />
                                <label
                                    htmlFor="password"
                                    className="uppercase font-bold"
                                >
                                    Lösenord:
                                </label>
                                <input
                                    type="password"
                                    placeholder="Lösenord"
                                    id="password"
                                    name="password"
                                    className="mb-4 p-3 pl-5 border-3 rounded-4xl bg-white z-10"
                                />
                            </div>
                            <input
                                type="submit"
                                value="Logga in!"
                                className="bg-pink-500 rounded-4xl p-3 border-3 uppercase font-bold hover:bg-pink-400 hover:cursor-pointer hover:border-pink-600 z-10 font-autour"
                            />
                        </form>
                        <img
                            alt="Piggy Bank Logo"
                            src="/logo.png"
                            width={300}
                            height={300}
                            className="absolute left-8 bottom-8 opacity-20 z-1"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
