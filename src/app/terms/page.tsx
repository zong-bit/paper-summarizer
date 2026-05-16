export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-text">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="space-y-4 text-text-secondary">
        <p>Last updated: May 14, 2026</p>
        <h2 className="text-xl font-semibold text-text mt-6">1. Acceptance of Terms</h2>
        <p>By using Paper Summarizer, you agree to these terms. If you do not agree, do not use the service.</p>
        <h2 className="text-xl font-semibold text-text mt-6">2. Description of Service</h2>
        <p>Paper Summarizer provides AI-powered tools for academic paper summarization, analysis, and research assistance.</p>
        <h2 className="text-xl font-semibold text-text mt-6">3. Subscriptions & Payments</h2>
        <p>Pro plans are billed monthly or annually. You may cancel at any time. As a digital product, all sales are final and no refunds are offered. Please see our <a href="/refund" className="text-primary hover:underline">Refund Policy</a> for details.</p>
        <h2 className="text-xl font-semibold text-text mt-6">4. User Responsibilities</h2>
        <p>Users must not misuse the service for spam, illegal activities, or automated abuse of the API.</p>
        <h2 className="text-xl font-semibold text-text mt-6">5. Limitation of Liability</h2>
        <p>The service is provided "as is". We are not liable for damages arising from use of the service.</p>
      </div>
    </main>
  );
}
