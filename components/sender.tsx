import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import axios from "axios";
import cheerio from "cheerio";
import { URL } from "url";

interface WebsiteField {
    InputString: string;
    setInputString: (value: string) => void;
    onNext: () => void;
}

async function extractLogo(url: string): Promise<string | null> {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Try finding favicon
        let iconHref = $('link[rel~="icon"]').attr('href');
        if (iconHref) {
            return new URL(iconHref, url).href;
        }

        // Try finding image with "logo" in alt, class, or id
        let imgLogo = $('img[alt*="logo"], img[class*="logo"], img[id*="logo"]').first();
        if (imgLogo.length) {
            let src = imgLogo.attr('src');
            return new URL(src, url).href;
        }

        return null;
    } catch (error) {
        console.error("Error extracting logo:", error);
        return null;
    }
}

export default function WebsiteSender({ InputString, setInputString, onNext }: WebsiteField) {
    const [error, setError] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    const validateInput = (input: string) => {
        // Regex to match a valid website format (e.g., anything.domain)
        const websiteRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
        return websiteRegex.test(input);
    };

    const handleNext = async () => {
        if (validateInput(InputString)) {
            setError(null);

            // Extract logo
            const formattedUrl = InputString.startsWith("http") ? InputString : `https://${InputString}`;
            const logo = await extractLogo(formattedUrl);
            if (logo) {
                setLogoUrl(logo);
                console.log("Logo URL:", logo);
            } else {
                console.log("No logo found for the website.");
            }

            sendData(InputString);
            onNext();
        } else {
            setError("Please enter a valid website (e.g., example.com).");
        }
    };

    const sendData = (InputString: string) => {
        const data = {
            name: InputString,
            logo: logoUrl,
        };
        console.log("Data sent:", data);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-[#083118]">Enter the name of your own brand:</h2>
            <div className="max-w-md mx-auto">
                <Input
                    className="h-14 border-[#083118] bg-white text-[#083118]"
                    placeholder="Your brand name (e.g., example.com)"
                    value={InputString}
                    onChange={(e) => setInputString(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <div className="flex justify-center">
                <Button
                    className="bg-[#083118] hover:bg-[#083118]/90 text-[#fffff3] px-8 py-6 text-lg"
                    onClick={handleNext}
                >
                    Next
                </Button>
            </div>
            {logoUrl && (
                <div className="mt-4 text-center">
                    <p className="text-[#083118]">Extracted Logo:</p>
                    <img src={logoUrl} alt="Extracted Logo" className="mx-auto max-h-20" />
                </div>
            )}
        </div>
    );
}