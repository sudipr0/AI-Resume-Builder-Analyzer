import React from "react";

const Terms = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Terms & Conditions
                </h1>

                <p className="mb-4">
                    Welcome to <strong>Resume Builder & Analyzer</strong>. By accessing
                    or using our platform, you agree to comply with and be bound by these
                    Terms & Conditions.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    1. Service Description
                </h2>
                <p className="mb-4">
                    Our platform provides resume creation tools, AI-powered resume
                    analysis, ATS score evaluation, and improvement suggestions. We do
                    not guarantee job placement or employment outcomes.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    2. User Responsibilities
                </h2>
                <ul className="list-disc pl-6 mb-4">
                    <li>Provide accurate and truthful information.</li>
                    <li>Do not upload harmful, illegal, or misleading content.</li>
                    <li>Do not attempt to hack or exploit the platform.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    3. Intellectual Property
                </h2>
                <p className="mb-4">
                    All platform design, branding, templates, and code belong to the
                    platform owner. Users retain ownership of their resume content.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    4. Account Security
                </h2>
                <p className="mb-4">
                    You are responsible for maintaining the confidentiality of your
                    account credentials and any activity under your account.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    5. Limitation of Liability
                </h2>
                <p className="mb-4">
                    The service is provided “as is”. We are not liable for job rejection,
                    incorrect AI suggestions, or data loss due to unforeseen technical
                    issues.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    6. Termination
                </h2>
                <p className="mb-4">
                    We reserve the right to suspend or terminate accounts that violate
                    these terms.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    7. Changes to Terms
                </h2>
                <p className="mb-4">
                    We may update these Terms at any time. Continued use of the platform
                    means you accept the revised Terms.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    8. Contact
                </h2>
                <p>
                    For questions, contact us at:{" "}
                    <strong>support@yourdomain.com</strong>
                </p>
            </div>
        </div>
    );
};

export default Terms;
