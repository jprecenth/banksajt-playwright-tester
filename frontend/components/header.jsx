import Link from "next/link";

export function Header() {
    return (
            <div className="bg-pink-400 text-center h-20 items-center justify-center flex w-full shrink-0 gap-4">
                <Link 
                href={"/"} 
                className="text-4xl flex items-center font-bold font-autour">
                BankSajt.se
                </Link>
                <div className="flex flex-col items-center">
                    <p>
                        Välkommen till BankSajt.se
                    </p>
                    <p className="italic text-sm">
                        – Sajten för Din Bank
                    </p>
                </div>
            </div>
    )
}