export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-text">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-4 text-text-secondary">
        <p>Last updated: May 14, 2026</p>
        <h2 className="text-xl font-semibold text-text mt-6">1. Information We Collect</h2>
        <p>We collect minimal data: email address (for Pro accounts), payment transaction IDs (via Paddle/Gumroad), and usage analytics.</p>
        <h2 className="text-xl font-semibold text-text mt-6">2. How We Use Your Data</h2>
        <p>To provide the service, process payments, and improve our tools. We do not sell your data.</p>
        <h2 className="text-xl font-semibold text-text mt-6">3. AI Processing</h2>
        <p>Paper text you submit is processed by our AI APIs for summarization. We do not store your uploaded content longer than necessary.</p>
        <h2 className="text-xl font-semibold text-text mt-6">4. Third Parties</h2>
        <p>We use Paddle/Gumroad for payment processing. Your payment info goes directly to them, not us.</p>
        <h2 className="text-xl font-semibold text-text mt-6">5. Contact</h2>
        <p>Email: paper-summarizer@googlegroups.com</p>
      </div>
    </main>
  );
}
