"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function History() {
    const [transactions, setTransactions] = useState([]);
    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        async function getTransactionData() {
            const data = localStorage.getItem("sessionToken");

            if (data) {
                setSignedIn(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ "token": data })
                })

                if (response.ok) {
                    const transactionData = await response.json();
                    setTransactions(transactionData)
                }
            }
        }
        getTransactionData()
    }, [])

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
                            <Link
                                href={"/account"}
                                className="underline hover:cursor-pointer">
                                Konto
                            </Link>
                            <span>/</span>
                            <span>
                                Transaktionshistorik
                            </span>
                        </p>
                        {
                            signedIn
                                ?
                                <>
                                    <p className="text-xl mb-2 font-autour font-black">
                                        Historik
                                    </p>
                                    <div className="flex flex-col gap-2 p-4 mb-3 z-10 w-[50%]">
                                        {
                                            (transactions.length > 0)
                                                ?
                                                <>
                                                    <span>
                                                        Insättningar kan göras på sidan för&nbsp;
                                                        <Link
                                                            href={"/account"}
                                                            className="underline hover:cursor-pointer">
                                                            ditt konto
                                                        </Link>.
                                                    </span>
                                                    <table className="[&_th,&_td]:border [&_th,&_td]:border-separate [&_th,&_td]:border-pink-400 [&_th,&_td]:p-2  max-w-200 w-full mt-3">
                                                        <thead>
                                                            <tr className="bg-pink-200 mr-2 pt-2 pb-2">
                                                                <th>Datum & Tid</th>
                                                                <th>Insättning (SEK)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody
                                                            className="[&_th,&_td]:border [&_th,&_td]:border-separate [&_th,&_td]:border-pink-400 [&_th,&_td]:p-2 text-right"
                                                        >
                                                            {transactions.map(transaction => (
                                                                <tr key={transaction.transID}>
                                                                    <td>
                                                                        {new Date(transaction.date_time).toLocaleString("sv-SE")}
                                                                    </td>
                                                                    <td>
                                                                        {Intl.NumberFormat('sv-SE', { style: 'decimal' }).format(transaction.transAmount)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </>
                                                :
                                                <div className="text-center bg-gray-200 p-3 w-fit">
                                                    <span id="emptyText">
                                                        Inga tidigare insättningar.
                                                        Gå till&nbsp;
                                                    </span>
                                                    <Link
                                                        href={"/account"}
                                                        className="underline hover:cursor-pointer">
                                                        ditt konto
                                                    </Link>
                                                    <span>
                                                        &nbsp;för att göra en insättning.
                                                    </span>
                                                </div>
                                        }
                                    </div>
                                </>
                                :
                                <div className="text-center flex flex-col bg-gray-200 p-3 w-fit">
                                    <span>
                                        Logga in för att se din transaktionshistorik.
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
        </div>
    );
}
