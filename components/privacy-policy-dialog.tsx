import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PrivacyPolicyDialogProps {
    children: React.ReactNode
}

export function PrivacyPolicyDialog({ children }: PrivacyPolicyDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-[#fffff3] text-[#083118]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Privacy Policy for Receivt.ro</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    <p className="text-[#083118]/80">
                        At Receivt.ro, we are committed to protecting your privacy. This Privacy Policy outlines the types of personal information we collect, how we use it, and the measures we take to ensure that your data is protected. By using our website, you agree to the collection and use of information in accordance with this policy.
                    </p>

                    <section>
                        <h3 className="text-xl font-semibold mb-2">1. Information We Collect</h3>
                        <p className="text-[#083118]/80">
                            We collect the following personal information when you visit or interact with our website:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-[#083118]/80">
                            <li>Email Address: We collect your email address when you sign up or contact us through our site.</li>
                            <li>Company Name: If you are signing up as a business, we will collect your company name.</li>
                            <li>Phone Number (Optional): You may choose to provide your phone number, but it is not required.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-2">2. Use of Personal Information</h3>
                        <p className="text-[#083118]/80">
                            We may use the collected information for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-[#083118]/80">
                            <li>To communicate with you regarding your inquiries or account-related matters.</li>
                            <li>To provide you with updates, offers, or information related to our services (if you have subscribed).</li>
                            <li>To improve our website and services through user feedback.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-2">3. Google Analytics</h3>
                        <p className="text-[#083118]/80">
                            We use Google Analytics to collect information about how visitors interact with our website. This helps us understand user behavior, optimize content, and enhance user experience. Google Analytics collects data such as:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-[#083118]/80">
                            <li>The pages you visit</li>
                            <li>The duration of your visit</li>
                            <li>Your IP address (anonymized)</li>
                        </ul>
                        <p className="text-[#083118]/80 mt-2">
                            All data collected by Google Analytics is anonymized and does not personally identify you.
                        </p>
                        <p className="text-[#083118]/80 mt-2">
                            For more information about how Google Analytics collects and processes data, please refer to Google's privacy policy.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-2">4. Data Protection</h3>
                        <p className="text-[#083118]/80">
                            We take reasonable steps to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-2">5. Third-Party Disclosure</h3>
                        <p className="text-[#083118]/80">
                            We do not sell, trade, or rent your personal information to third parties. We may, however, share information with third-party service providers (such as Google Analytics) that assist in operating our website and services, provided they agree to keep this information confidential.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-2">6. Your Rights</h3>
                        <p className="text-[#083118]/80">
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-[#083118]/80">
                            <li>Access the personal information we hold about you.</li>
                            <li>Correct or update any personal information we hold.</li>
                            <li>Request the deletion of your personal information (subject to any legal obligations).</li>
                        </ul>
                        <p className="text-[#083118]/80 mt-2">
                            If you wish to exercise any of these rights, please contact us at office@receivt.ro.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-2">7. Changes to This Privacy Policy</h3>
                        <p className="text-[#083118]/80">
                            We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this policy periodically.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-2">8. Contact Us</h3>
                        <p className="text-[#083118]/80">
                            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                        </p>
                        <p className="text-[#083118]/80 mt-2">
                            Email: office@receivt.ro
                        </p>
                        <p className="text-[#083118]/80 mt-4">
                            Effective Date: 08.05.2025
                        </p>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    )
} 