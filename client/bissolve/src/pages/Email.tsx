import React, { useState } from "react";
import { Loader, FileText, X } from "lucide-react";

interface Recipient {
  email: string;
  name: string;
}

const EmailSender: React.FC = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // ✅ Email validation
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ✅ Add recipients
  const addRecipients = () => {
    const emails = recipientInput
      .split(/[,;\n]/)
      .map(e => e.trim())
      .filter(isValidEmail);

    if (!emails.length) {
      setError("Enter valid email addresses");
      return;
    }

    const unique = emails.filter(
      e => !recipients.some(r => r.email === e)
    );

    setRecipients([
      ...recipients,
      ...unique.map(e => ({ email: e, name: e.split("@")[0] }))
    ]);

    setRecipientInput("");
    setError("");
  };

  // ✅ Generate email content
  const generateEmail = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:3000/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: topic,
          tone: "professional",
          emailType: "newsletter"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate email");

      setSubject(data.subject);
      setHtml(data.html);
      setShowPreview(true);
    } catch (err: any) {
      setError(err.message || "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Send emails
  const sendEmails = async () => {
    if (!recipients.length || !subject || !html) {
      setError("Missing email data");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipients.map(r => r.email),
          subject,
          html
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send email");

      alert("Emails sent successfully!");
      setRecipients([]);
      setSubject("");
      setHtml("");
      setTopic("");
      setShowPreview(false);
    } catch (err: any) {
      setError(err.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FileText /> AI Email Generator
      </h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      {/* Topic input */}
      <textarea
        className="w-full border p-3 rounded mb-3"
        placeholder="Enter email topic..."
        value={topic}
        onChange={e => setTopic(e.target.value)}
      />

      <button
        onClick={generateEmail}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? <Loader className="animate-spin" /> : "Generate Email"}
      </button>

      {/* Preview */}
      {showPreview && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Subject</h3>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />

          <h3 className="font-bold mb-2">Preview</h3>
          <div
            className="border p-4 rounded bg-gray-50"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}

      {/* Recipients input */}
      <div className="mt-6">
        <textarea
          placeholder="Enter recipient emails (comma, semicolon, or newline separated)..."
          className="w-full border p-3 rounded"
          value={recipientInput}
          onChange={e => setRecipientInput(e.target.value)}
        />
        <button
          onClick={addRecipients}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Recipients
        </button>
      </div>

      {/* Recipient list */}
      <ul className="mt-4">
        {recipients.map(r => (
          <li key={r.email} className="flex justify-between py-1">
            {r.email}
            <X
              className="cursor-pointer text-red-500"
              onClick={() =>
                setRecipients(recipients.filter(x => x.email !== r.email))
              }
            />
          </li>
        ))}
      </ul>

      {/* Send button */}
      <button
        onClick={sendEmails}
        disabled={loading}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded"
      >
        {loading ? "Sending..." : "Send Emails"}
      </button>
    </div>
  );
};

export default EmailSender;
