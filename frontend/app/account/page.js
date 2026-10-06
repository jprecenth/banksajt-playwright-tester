"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function validateAmount(amountNumber) {
    return amountNumber > 0 && Number.isFinite(amountNumber)
}

export default function Account() {
    const [signedIn, setSignedIn] = useState(false);
    const [balance, setBalance] = useState(0);

    let localizedBalance = new Intl.NumberFormat('sv-SE', { style: 'decimal' }).format(balance);

    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        async function showBalance() {
            const token = localStorage.getItem("sessionToken")

            if (token) {
                setSignedIn(true)
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/accounts?token=${token}`, {
                    method: "GET",
                },
                )
                if (response.ok) {
                    const data = await response.json();
                    setBalance(data.amount)
                }
            }
        }
        showBalance()
    }, [])

    async function handleTransaction(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const inputAmount = Object.fromEntries(formData);
        const amountNumber = Number(inputAmount.amount);

        if (validateAmount(amountNumber)) {
            const token = localStorage.getItem("sessionToken")

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/accounts/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "token": token, "amount": amountNumber })
            })

            if (response.ok) {
                setShowConfirmation(true)
                const data = await response.json();
                setBalance(data.amount)
            }
        }
        else {
            setShowError(true)
        }
    }

    const router = useRouter();

    function HandleSignOut() {
        localStorage.removeItem("sessionToken");
        setSignedIn(false);
        router.push("/");
        return true
    }

    return (
        <div className="flex h-screen overflow-hidden flex-col font-sans dark:bg-black ">
            <div className="bg-pink-400 text-center h-20 items-center justify-center flex w-full shrink-0 gap-4">
                <div className="text-4xl flex items-center font-bold font-autour">
                    BankSajt.se
                </div>
                <div className="flex flex-col items-center">
                    <p>
                        Välkommen till BankSajt.se
                    </p>
                    <p className="italic text-sm">
                        – Sajten för Din Bank
                    </p>
                </div>
            </div>
            <main className="main-content flex min-h-0 flex-1">
                <div className="sidebar w-max-[30%] flex-1 bg-pink-300 p-8 ">
                    <div className="flex flex-col *:bg-pink-500 *:rounded-4xl *:p-3 *:m-3 *:text-black *:border-3 *:uppercase *:font-bold *:hover:bg-pink-400 *:hover:cursor-pointer *:hover:border-pink-600 text-center *:text-nowrap font-autour w-43">
                        <Link
                            href={"/"}>
                            Startsida
                        </Link>
                        {
                            signedIn
                                ?
                                <button
                                    onClick={HandleSignOut}>
                                    Logga ut
                                </button>
                                :
                                <><Link
                                    href={"/login"}>
                                    Logga In
                                </Link>
                                    <Link
                                        href={"/register"}>
                                        Skapa Konto
                                    </Link>
                                </>
                        }
                    </div>
                </div>
                <div className="content-section w-full">
                    <div className="hero-section flex flex-col relative w-full h-full p-8 items-start">
                        <p className="mb-5 *:p-1 text-md text-gray-600">
                            <Link
                                href={"/"}
                                className="underline hover:cursor-pointer">
                                Hem
                            </Link>
                            <span>/</span>
                            <span>
                                Konto
                            </span>
                        </p>
                        {
                            signedIn
                                ?
                                <>
                                    <p className="text-xl mb-2 font-autour font-black">
                                        Saldo
                                    </p>
                                    <div className="flex gap-2 p-4 mb-3 z-10">
                                        <span className="font-bold">
                                            Aktuellt saldo:
                                        </span>
                                        <span id="yourBalance">
                                            {localizedBalance}
                                        </span>
                                        <span>
                                            sek
                                        </span>
                                    </div>
                                    <p className="text-xl mb-2 mt-5 font-autour font-black">
                                        Insättningar
                                    </p>
                                    <form
                                        className="p-4 flex flex-col justify-center items-end z-10 *:pr-4"
                                        onSubmit={handleTransaction}
                                    >
                                        <div className="flex gap-2 items-center">
                                            <label
                                                htmlFor="amount"
                                                className="font-bold">
                                                Summa
                                            </label>
                                            <input
                                                name="amount"
                                                id="amount"
                                                placeholder="Mängd"
                                                className="p-3 pl-5 border-3 rounded-4xl bg-white z-10"
                                                type="number"
                                            />
                                            <input
                                                type="submit"
                                                value="Sätt in"
                                                className="bg-pink-500 rounded-4xl p-3 border-3 uppercase font-bold hover:bg-pink-400 hover:cursor-pointer hover:border-pink-600 z-10 font-autour w-fit"
                                            />
                                        </div>
                                        {showConfirmation && (
                                            <p className="mt-2">
                                                ✓ Insättning validerad!
                                            </p>
                                        )}
                                        {showError && (
                                            <p className="flex flex-col">
                                                <span 
                                                className="mt-2 text-pink-700"
                                                id="errorText">
                                                    ✗ Otillåten insättning!
                                                </span>
                                                <span>
                                                    Insättningar måste vara ett nummer över noll.
                                                </span>
                                            </p>
                                        )}
                                    </form>
                                    <p className="text-xl mb-2 mt-5 font-autour font-black">
                                        Transaktionshistorik
                                    </p>
                                    <div className="flex p-4">
                                        <span>
                                            Se din transaktionshistorik i detalj&nbsp;
                                        </span>
                                        <Link
                                            href={"/history"}
                                            className="underline hover:cursor-pointer">
                                            här
                                        </Link>.
                                    </div>
                                </>
                                :
                                <div className="text-center flex flex-col bg-gray-200 p-3 w-fit">
                                    <span>
                                        Logga in för att se ditt saldo och sätta in pengar på ditt konto.
                                    </span>
                                    <Link
                                        href={"/login"}
                                        className="underline hover:cursor-pointer">
                                        Logga in här.
                                    </Link>
                                </div>
                        }
                        <img
                            alt="Piggy Bank Logo"
                            src="/logo.png"
                            width={300}
                            height={300}
                            className="absolute right-8 bottom-8 opacity-20 z-1 -scale-x-100"
                        />
                    </div>
                </div>
            </main >
        </div >
    );
}
