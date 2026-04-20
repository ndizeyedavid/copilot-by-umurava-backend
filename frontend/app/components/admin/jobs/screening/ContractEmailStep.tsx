"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Mail,
  FileText,
  CheckCircle2,
  Loader2,
  User,
  Download,
  Eye,
  Edit3,
} from "lucide-react";

export type ContractWithEmail = {
  candidateId: string;
  name: string;
  email: string;
  position: string;
  contractText: string;
  status?: "pending" | "sent" | "signed" | "declined";
};

const DEFAULT_CONTRACT_EMAIL = {
  subject: "Employment Contract - {{position}} at Umurava",
  body: `Dear {{candidateName}},

Congratulations! We are pleased to offer you the position of {{position}} at Umurava.

Please find attached your employment contract for review and signature.

📋 Contract Details:
• Position: {{position}}
• Start Date: As discussed
• Documents attached: Employment Agreement

Next Steps:
1. Review the attached contract carefully
2. Sign and date where indicated
3. Return the signed contract by replying to this email

If you have any questions about the contract terms, please don't hesitate to reach out.

We are excited to have you join our team!

Best regards,
Umurava Hiring Team`,
};

export default function ContractEmailStep({
  candidates,
  jobTitle,
  onSend,
  onBack,
  onComplete,
}: {
  candidates: ContractWithEmail[];
  jobTitle: string;
  onSend: (candidateId: string, emailData: { subject: string; body: string }) => Promise<void>;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [subject, setSubject] = useState(DEFAULT_CONTRACT_EMAIL.subject);
  const [body, setBody] = useState(DEFAULT_CONTRACT_EMAIL.body);
  const [isEditing, setIsEditing] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [previewId, setPreviewId] = useState<string | null>(null);

  const replaceVariables = (text: string, candidate: ContractWithEmail) => {
    return text
      .replace(/{{candidateName}}/g, candidate.name)
      .replace(/{{position}}/g, jobTitle)
      .replace(/{{email}}/g, candidate.email);
  };

  const handleSend = async (candidate: ContractWithEmail) => {
    setSendingId(candidate.candidateId);
    try {
      await onSend(candidate.candidateId, {
        subject: replaceVariables(subject, candidate),
        body: replaceVariables(body, candidate),
      });
      setSentIds((prev) => new Set(prev).add(candidate.candidateId));
    } finally {
      setSendingId(null);
    }
  };

  const handleSendAll = async () => {
    const pending = candidates.filter((c) => !sentIds.has(c.candidateId));
    for (const c of pending) {
      await handleSend(c);
    }
  };

  const allSent = candidates.every((c) => sentIds.has(c.candidateId));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C8493] hover:text-[#25324B] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Contract Generation
        </button>
        <div className="flex items-center gap-2 text-sm text-[#7C8493]">
          <Mail className="h-4 w-4" />
          <span>Send Contracts for Signature</span>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-blue-100 bg-[#F8F8FD] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#286ef0]/10 text-[#286ef0]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-[#25324B]">
                {sentIds.size} of {candidates.length} contracts sent
              </p>
              <p className="text-xs text-[#7C8493]">
                {allSent ? "All contracts have been sent!" : "Send contracts to candidates"}
              </p>
            </div>
          </div>
          {!allSent && (
            <button
              onClick={handleSendAll}
              disabled={sendingId !== null}
              className="inline-flex items-center gap-2 rounded-lg bg-[#286ef0] px-4 py-2 text-sm font-bold text-white hover:bg-[#1f5fe0] disabled:opacity-50"
            >
              {sendingId ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send All
            </button>
          )}
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-[#286ef0] transition-all"
            style={{ width: `${(sentIds.size / candidates.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Email Template */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#25324B]">Email Template</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                isEditing ? "bg-[#286ef0] text-white" : "bg-gray-100 text-[#25324B] hover:bg-gray-200"
              }`}
            >
              <Edit3 className="h-3 w-3" />
              {isEditing ? "Done" : "Edit"}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#25324B]">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#286ef0]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#25324B]">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#286ef0] font-mono"
                />
              </div>
              <p className="text-xs text-[#7C8493]">
                Variables: {"{{candidateName}}, {{position}}, {{email}}"}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
              <p className="font-semibold text-[#25324B]">
                {replaceVariables(subject, candidates[0] || { name: "Candidate", email: "", position: jobTitle, candidateId: "", contractText: "" })}
              </p>
              <p className="text-sm text-[#25324B] whitespace-pre-wrap">
                {replaceVariables(body, candidates[0] || { name: "Candidate", email: "", position: jobTitle, candidateId: "", contractText: "" })}
              </p>
            </div>
          )}
        </div>

        {/* Right: Candidates List */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#25324B]">Candidates</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {candidates.map((c) => {
              const isSent = sentIds.has(c.candidateId);
              const isSending = sendingId === c.candidateId;

              return (
                <div
                  key={c.candidateId}
                  className={`rounded-lg border p-3 transition-all ${
                    isSent ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#25324B]">{c.name}</p>
                        <p className="text-xs text-[#7C8493]">{c.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSent ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSend(c)}
                          disabled={isSending}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#286ef0] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1f5fe0] disabled:opacity-50"
                        >
                          {isSending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Send className="h-3 w-3" />
                          )}
                          Send
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-[#7C8493]">
          {allSent ? (
            <span className="inline-flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              All contracts sent successfully!
            </span>
          ) : (
            <span>Send contracts to all candidates to complete</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-lg border border-gray-200 px-6 py-2 text-sm font-semibold text-[#25324B] hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={onComplete}
            disabled={!allSent}
            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <CheckCircle2 className="h-4 w-4" />
            Complete Hiring Process
          </button>
        </div>
      </div>
    </div>
  );
}
