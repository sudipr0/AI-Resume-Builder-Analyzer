import React from "react";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Privacy Policy
                </h1>

                <p className="mb-4">
                    This Privacy Policy explains how Resume Builder & Analyzer collects,
                    uses, and protects your information.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    1. Information We Collect
                </h2>
                <ul className="list-disc pl-6 mb-4">
                    <li>Name and email address</li>
                    <li>Resume data (education, skills, experience)</li>
                    <li>Usage data (IP address, browser type, device info)</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    2. How We Use Information
                </h2>
                <ul className="list-disc pl-6 mb-4">
                    <li>Provide resume building services</li>
                    <li>Analyze resumes using AI</li>
                    <li>Improve platform performance</li>
                    <li>Prevent fraud and misuse</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    3. Data Security
                </h2>
                <p className="mb-4">
                    We implement reasonable security measures to protect your data.
                    However, no system is completely secure.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    4. Third-Party Services
                </h2>
                <p className="mb-4">
                    We may use third-party services such as hosting providers or AI APIs.
                    These services may process necessary data to provide functionality.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    5. Data Retention
                </h2>
                <p className="mb-4">
                    We retain your data while your account is active or until you request
                    deletion.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    6. Cookies
                </h2>
                <p className="mb-4">
                    We may use cookies to maintain login sessions and improve user
                    experience.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    7. Your Rights
                </h2>
                <p className="mb-4">
                    You may request to access, update, or delete your personal data at
                    any time.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    8. Contact
                </h2>
                <p>
                    For privacy-related concerns, contact:{" "}
                    <strong>support@yourdomain.com</strong>
                </p>
            </div>
        </div>
    );
};

export default Privacy;
