"use client";

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useMemo, useState } from "react";
import { getFirebaseFirestore, getFirebaseStorage } from "@/lib/firebase-db";
import type { AssignmentCode } from "@/lib/team";
import { TEAM_MEMBERS } from "@/lib/team";

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_BYTES = 10 * 1024 * 1024;

type TabKey = "BAY" | "IFS";

type DocumentRow = {
  id: string;
  assignment: AssignmentCode;
  uploaderName: string;
  taskName: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Timestamp | null;
};

function isAllowedFile(file: File): boolean {
  const lower = file.name.toLowerCase();
  const byExt = lower.endsWith(".pdf") || lower.endsWith(".docx");
  if (!file.type) return byExt;
  return ALLOWED_MIME.has(file.type) || byExt;
}

function sanitizePathSegment(value: string): string {
  return value.replace(/[/\\]/g, "-").trim() || "file";
}

export default function DocumentsPage() {
  const [tab, setTab] = useState<TabKey>("BAY");
  const [uploaderName, setUploaderName] = useState(TEAM_MEMBERS[0]?.name ?? "");
  const [taskName, setTaskName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<DocumentRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const memberNames = useMemo(() => TEAM_MEMBERS.map((m) => m.name), []);

  useEffect(() => {
    const db = getFirebaseFirestore();
    if (!db) {
      setConfigError("Firebase is not configured.");
      return;
    }
    const q = query(
      collection(db, "documents"),
      where("assignment", "==", tab),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const next: DocumentRow[] = snap.docs.map((doc) => {
          const data = doc.data() as Record<string, unknown>;
          return {
            id: doc.id,
            assignment: data.assignment as AssignmentCode,
            uploaderName: String(data.uploaderName ?? ""),
            taskName: String(data.taskName ?? ""),
            fileName: String(data.fileName ?? ""),
            fileUrl: String(data.fileUrl ?? ""),
            uploadedAt: (data.uploadedAt as Timestamp | undefined) ?? null,
          };
        });
        next.sort((a, b) => {
          const at = a.uploadedAt?.toMillis() ?? 0;
          const bt = b.uploadedAt?.toMillis() ?? 0;
          return bt - at;
        });
        setRows(next);
        setConfigError(null);
      },
      () => {
        setConfigError("Could not load documents. Check Firestore rules and your connection.");
      },
    );
    return () => unsub();
  }, [tab]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const storage = getFirebaseStorage();
    const db = getFirebaseFirestore();
    if (!storage || !db) {
      setError("Firebase is not configured.");
      return;
    }

    if (!uploaderName.trim()) {
      setError("Select your name.");
      return;
    }
    if (!taskName.trim()) {
      setError("Enter a task name.");
      return;
    }
    if (!file) {
      setError("Choose a PDF or DOCX file (max 10MB).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }
    if (!isAllowedFile(file)) {
      setError("Only PDF or DOCX files are allowed.");
      return;
    }

    const assignment = tab;
    const safeUploader = sanitizePathSegment(uploaderName.trim());
    const safeFile = sanitizePathSegment(file.name);
    const objectPath = `documents/${assignment}/${safeUploader}/${safeFile}`;

    setUploading(true);
    try {
      const storageRef = ref(storage, objectPath);
      await uploadBytes(storageRef, file, {
        contentType: file.type || undefined,
      });
      const fileUrl = await getDownloadURL(storageRef);
      await addDoc(collection(db, "documents"), {
        assignment,
        uploaderName: uploaderName.trim(),
        taskName: taskName.trim(),
        fileName: file.name,
        fileUrl,
        uploadedAt: serverTimestamp(),
      });
      setTaskName("");
      setFile(null);
    } catch {
      setError("Upload failed. Check Storage rules and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white">Documents</h1>
        <p className="mt-2 text-slate-300">
          Upload drafts and view team submissions by assignment.
        </p>
      </div>

      <div className="flex gap-2 rounded-xl border border-slate-700 bg-slate-800/50 p-1">
        {(["BAY", "IFS"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === key
                ? key === "BAY"
                  ? "bg-teal-600 text-white"
                  : "bg-indigo-500 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {key}03A1
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-slate-700 bg-slate-800 p-6">
        <h2 className="text-lg font-semibold text-white">Upload</h2>
        <form
          onSubmit={(e) => void handleUpload(e)}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-1">
            <label
              htmlFor="uploader"
              className="mb-1 block text-sm font-medium text-slate-300"
            >
              Your name
            </label>
            <select
              id="uploader"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-teal-600/40"
            >
              {memberNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="task"
              className="mb-1 block text-sm font-medium text-slate-300"
            >
              Task name
            </label>
            <input
              id="task"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder='e.g. Q1 - Strategies'
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-teal-600/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="file"
              className="mb-1 block text-sm font-medium text-slate-300"
            >
              File (PDF or DOCX, max 10MB)
            </label>
            <input
              id="file"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-600"
            />
          </div>
          {error ? (
            <p
              className="sm:col-span-2 rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-200"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          {configError ? (
            <p
              className="sm:col-span-2 rounded-lg border border-amber-900/50 bg-amber-950/40 px-3 py-2 text-sm text-amber-100"
              role="status"
            >
              {configError}
            </p>
          ) : null}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-[#0d9488] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-800 p-6">
        <h2 className="text-lg font-semibold text-white">Submissions</h2>
        <p className="mt-1 text-sm text-slate-400">
          Showing {tab}03A1 uploads only.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-slate-700 text-xs uppercase tracking-wide text-slate-400">
                <th className="py-3 pr-4 font-medium">Uploader</th>
                <th className="py-3 pr-4 font-medium">Task</th>
                <th className="py-3 pr-4 font-medium">File</th>
                <th className="py-3 pr-4 font-medium">Uploaded</th>
                <th className="py-3 font-medium">Download</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-slate-500"
                  >
                    No submissions yet for this tab.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-700/80 last:border-0"
                  >
                    <td className="py-3 pr-4 align-top text-white">
                      {row.uploaderName}
                    </td>
                    <td className="py-3 pr-4 align-top">{row.taskName}</td>
                    <td className="py-3 pr-4 align-top">{row.fileName}</td>
                    <td className="py-3 pr-4 align-top">
                      {row.uploadedAt
                        ? row.uploadedAt.toDate().toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-3 align-top">
                      <a
                        href={row.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-teal-400 hover:text-teal-300"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
