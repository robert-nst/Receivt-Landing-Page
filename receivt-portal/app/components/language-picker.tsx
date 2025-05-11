/**
 * v0 by Vercel.
 * @see https://v0.dev/t/IasA7fhkREA
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { JSX, SVGProps, useState } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useLanguage } from "../contexts/language-context"

export default function Component() {
    const { language, setLanguage, t } = useLanguage()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <img
                        src={language === "en" ? "/english.png" : "/romanian.png"}
                        alt={language === "en" ? "US Flag" : "Romanian Flag"}
                        width={24}
                        height={24}
                        className="rounded-full"
                        style={{ aspectRatio: "24/24", objectFit: "cover" }}
                    />
                    <span className="font-medium">{t("language.select")}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setLanguage("en")}>
                        <div className="flex items-center gap-2">
                            <img
                                src="/english.png"
                                alt="US Flag"
                                width={24}
                                height={24}
                                className="rounded-full"
                                style={{ aspectRatio: "24/24", objectFit: "cover" }}
                            />
                            <span>English</span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("ro")}>
                        <div className="flex items-center gap-2">
                            <img
                                src="/romanian.png"
                                alt="Romanian Flag"
                                width={24}
                                height={24}
                                className="rounded-full"
                                style={{ aspectRatio: "24/24", objectFit: "cover" }}
                            />
                            <span>Română</span>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function ChevronDownIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}