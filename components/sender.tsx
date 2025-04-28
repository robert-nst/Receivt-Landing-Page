import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

interface WebsiteField {
    InputString: string;
    setInputString: (value: string) => void;
    onNext: () => void;
}

function sendData(InputString: string) {
    const data = {
        name: InputString
    };
    console.log("Data sent:", data);
}

export default function WebsiteSender({ InputString, setInputString, onNext }: WebsiteField) {
    const [error, setError] = useState<string | null>(null);

    const validateInput = (input: string) => {
        // Regex to match a valid website format (e.g., anything.domain)
        const websiteRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
        return websiteRegex.test(input);
    };

    const handleNext = () => {
        if (validateInput(InputString)) {
            setError(null);
            sendData(InputString);
            onNext();
        } else {
            setError("Please enter a valid website (e.g., example.com).");
        }
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
        </div>
    );
}