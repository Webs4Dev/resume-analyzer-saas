"use client"

import axios from "axios"
import { useState } from "react"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [jd, setJD] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleUpload = async () => {
    if (!file) { alert("Upload a resume first!"); return }
    setLoading(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append("resume", file)
      formData.append("job_description", jd)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/analyze-pdf`, formData)
      setResult(res.data)
    } catch {
      alert("Error analyzing resume. Make sure the API is running.")
    }
    setLoading(false)
  }

  const formatFeedback = (text: string) => {
    const matched  = text.match(/\[MATCHED SKILLS\]([\s\S]*?)\[MISSING SKILLS\]/)
    const missing  = text.match(/\[MISSING SKILLS\]([\s\S]*?)\[SUGGESTED PROJECTS\]/)
    const projects = text.match(/\[SUGGESTED PROJECTS\]([\s\S]*?)\[TAILORED PROFESSIONAL SUMMARY\]/)
    const summary  = text.match(/\[TAILORED PROFESSIONAL SUMMARY\]([\s\S]*?)\[ACTION PLAN\]/)
    const action   = text.match(/\[ACTION PLAN\]([\s\S]*)/)
    return {
      MATCHED:  matched?.[1]?.trim()  ?? "",
      MISSING:  missing?.[1]?.trim()  ?? "",
      PROJECTS: projects?.[1]?.trim() ?? "",
      SUMMARY:  summary?.[1]?.trim()  ?? "",
      ACTION:   action?.[1]?.trim()   ?? "",
    }
  }

  const score = result ? result[0]?.match_percentage ?? 0 : 0
  const feedback = result ? formatFeedback(result[1]) : null

  const scoreColor =
    score >= 75 ? "#0d9e72" :
    score >= 50 ? "#d97706" : "#dc2626"

  const scoreLabel =
    score >= 75 ? "Strong Match" :
    score >= 50 ? "Partial Match" : "Weak Match"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Instrument+Sans:wght@300;400;500;600&family=Martian+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --paper:    #f5f2ed;
          --paper2:   #edeae4;
          --ink:      #1a1814;
          --ink2:     #3d3a34;
          --ink3:     #8a8780;
          --rule:     rgba(26,24,20,0.1);
          --teal:     #0b7c5e;
          --teal-dim: rgba(11,124,94,0.08);
          --teal-mid: rgba(11,124,94,0.18);
          --red:      #c0392b;
          --red-dim:  rgba(192,57,43,0.07);
          --amber:    #b45309;
          --amber-dim:rgba(180,83,9,0.07);
          --green:    #0d9e72;
          --green-dim:rgba(13,158,114,0.08);
        }

        body {
          font-family: 'Instrument Sans', sans-serif;
          background: var(--paper);
          color: var(--ink);
          min-height: 100vh;
        }

        /* Subtle paper texture via repeating gradient */
        .page-bg {
          min-height: 100vh;
          background:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 31px,
              rgba(26,24,20,0.03) 31px,
              rgba(26,24,20,0.03) 32px
            ),
            var(--paper);
          padding: 0 0 6rem 0;
        }

        /* ── Top bar ── */
        .topbar {
          border-bottom: 1px solid var(--rule);
          padding: 1.1rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--paper);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .topbar-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.3px;
        }
        .topbar-logo span { color: var(--teal); }
        .topbar-tag {
          font-family: 'Martian Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--ink3);
          border: 1px solid var(--rule);
          padding: 3px 10px;
          border-radius: 3px;
        }
        .topbar-right {
          font-family: 'Martian Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--ink3);
        }

        /* ── Hero ── */
        .hero {
          max-width: 760px;
          margin: 4rem auto 3rem auto;
          padding: 0 2rem;
          text-align: center;
        }
        .hero-eyebrow {
          font-family: 'Martian Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 1rem;
        }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.2rem;
          font-weight: 700;
          color: var(--ink);
          line-height: 1.1;
          letter-spacing: -0.5px;
          margin-bottom: 1rem;
        }
        .hero-title em { color: var(--teal); font-style: italic; }
        .hero-sub {
          font-size: 0.95rem;
          color: var(--ink3);
          line-height: 1.7;
          font-weight: 300;
        }

        /* ── Main container ── */
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* ── Card ── */
        .card {
          background: #fff;
          border: 1px solid var(--rule);
          border-radius: 12px;
          padding: 2.2rem 2.4rem;
          margin-bottom: 1.6rem;
          box-shadow: 0 1px 3px rgba(26,24,20,0.06), 0 4px 20px rgba(26,24,20,0.04);
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1.6rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--rule);
        }
        .card-num {
          width: 28px; height: 28px;
          background: var(--teal-dim);
          border: 1px solid var(--teal-mid);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Martian Mono', monospace;
          font-size: 0.65rem;
          color: var(--teal);
          font-weight: 500;
          flex-shrink: 0;
        }
        .card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--ink);
        }
        .card-sub {
          font-family: 'Martian Mono', monospace;
          font-size: 0.56rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--ink3);
          margin-top: 2px;
        }

        /* ── Drop zone ── */
        .drop-zone {
          border: 2px dashed var(--rule);
          border-radius: 10px;
          padding: 2.2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--paper);
          position: relative;
        }
        .drop-zone:hover, .drop-zone.active {
          border-color: var(--teal);
          background: var(--teal-dim);
        }
        .drop-zone input[type="file"] {
          position: absolute; inset: 0;
          opacity: 0; cursor: pointer; width: 100%; height: 100%;
        }
        .drop-icon {
          font-size: 2rem;
          margin-bottom: 0.6rem;
          display: block;
          opacity: 0.5;
        }
        .drop-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--ink2);
          margin-bottom: 0.3rem;
        }
        .drop-hint {
          font-family: 'Martian Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--ink3);
        }
        .file-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--teal-dim);
          border: 1px solid var(--teal-mid);
          border-radius: 6px;
          padding: 6px 14px;
          margin-top: 0.8rem;
          font-family: 'Martian Mono', monospace;
          font-size: 0.65rem;
          color: var(--teal);
          letter-spacing: 0.5px;
        }

        /* ── Textarea ── */
        .jd-label {
          font-family: 'Martian Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--ink3);
          display: block;
          margin-bottom: 0.6rem;
        }
        .jd-textarea {
          width: 100%;
          background: var(--paper);
          border: 1px solid var(--rule);
          border-radius: 8px;
          padding: 1rem 1.2rem;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 0.88rem;
          color: var(--ink);
          line-height: 1.6;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s;
        }
        .jd-textarea::placeholder { color: var(--ink3); }
        .jd-textarea:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(11,124,94,0.07); }

        /* ── Button ── */
        .analyze-btn {
          width: 100%;
          margin-top: 1.4rem;
          padding: 0.9rem;
          background: var(--teal);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'Martian Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }
        .analyze-btn:hover { background: #0a6b50; box-shadow: 0 4px 16px rgba(11,124,94,0.25); }
        .analyze-btn:disabled { background: var(--ink3); cursor: not-allowed; box-shadow: none; }

        /* ── Loader ── */
        .loader-wrap {
          text-align: center;
          padding: 2.5rem;
        }
        .loader-dots {
          display: inline-flex;
          gap: 6px;
          margin-bottom: 1rem;
        }
        .loader-dots span {
          width: 7px; height: 7px;
          background: var(--teal);
          border-radius: 50%;
          animation: bounce 1.2s infinite ease-in-out;
        }
        .loader-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loader-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
          40%          { transform: scale(1.1); opacity: 1; }
        }
        .loader-text {
          font-family: 'Martian Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--ink3);
        }

        /* ── Score banner ── */
        .score-banner {
          background: #fff;
          border: 1px solid var(--rule);
          border-radius: 12px;
          padding: 2rem 2.4rem;
          margin-bottom: 1.6rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          box-shadow: 0 1px 3px rgba(26,24,20,0.06);
        }
        .score-left {}
        .score-eyebrow {
          font-family: 'Martian Mono', monospace;
          font-size: 0.57rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--ink3);
          margin-bottom: 0.4rem;
        }
        .score-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 4rem;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -2px;
        }
        .score-label {
          font-family: 'Martian Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 0.4rem;
          font-weight: 500;
        }
        .score-bar-wrap {
          flex: 1;
          max-width: 420px;
        }
        .score-bar-track {
          height: 6px;
          background: var(--paper2);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 0.6rem;
        }
        .score-bar-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 1s ease;
        }
        .score-bar-labels {
          display: flex;
          justify-content: space-between;
          font-family: 'Martian Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 1px;
          color: var(--ink3);
          text-transform: uppercase;
        }

        /* ── Result grid ── */
        .result-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.4rem;
          margin-bottom: 1.6rem;
        }
        .result-card {
          background: #fff;
          border: 1px solid var(--rule);
          border-radius: 12px;
          padding: 1.8rem 2rem;
          box-shadow: 0 1px 3px rgba(26,24,20,0.05);
        }
        .result-card.full { grid-column: 1 / -1; }
        .result-tag {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: 'Martian Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 1rem;
          padding: 4px 12px;
          border-radius: 4px;
        }
        .tag-green  { background: var(--green-dim);  color: var(--green); border: 1px solid rgba(13,158,114,0.2); }
        .tag-red    { background: var(--red-dim);    color: var(--red);   border: 1px solid rgba(192,57,43,0.18); }
        .tag-teal   { background: var(--teal-dim);   color: var(--teal);  border: 1px solid var(--teal-mid); }
        .tag-ink    { background: var(--paper2);     color: var(--ink2);  border: 1px solid var(--rule); }
        .tag-amber  { background: var(--amber-dim);  color: var(--amber); border: 1px solid rgba(180,83,9,0.2); }
        .result-body {
          font-size: 0.88rem;
          color: var(--ink2);
          line-height: 1.75;
          white-space: pre-line;
          font-weight: 300;
        }

        /* ── Footer ── */
        .footer {
          max-width: 900px;
          margin: 3rem auto 0 auto;
          padding: 1.4rem 2rem 0 2rem;
          border-top: 1px solid var(--rule);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          color: var(--ink3);
        }
        .footer-brand span { color: var(--teal); }
        .footer-meta {
          font-family: 'Martian Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 2px;
          color: var(--ink3);
          text-transform: uppercase;
        }
      `}</style>

      <div className="page-bg">

        {/* Top bar */}
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
            <div className="topbar-logo">Resume<span>Lens</span></div>
            <div className="topbar-tag">AI-Powered Analysis</div>
          </div>
          <div className="topbar-right">ATS · Skills · Roadmap</div>
        </div>

        {/* Hero */}
        <div className="hero">
          <div className="hero-eyebrow">Career Intelligence Platform</div>
          <h1 className="hero-title">
            Know exactly how your<br />
            resume <em>measures up</em>
          </h1>
          <p className="hero-sub">
            Upload your resume and paste a job description. Our AI scores ATS compatibility,
            maps skill gaps, and writes your tailored professional summary.
          </p>
        </div>

        <div className="container">

          {/* Upload card */}
          <div className="card">
            <div className="card-header">
              <div className="card-num">01</div>
              <div>
                <div className="card-title">Upload Your Resume</div>
                <div className="card-sub">PDF format · max 10MB</div>
              </div>
            </div>

            <div
              className={`drop-zone ${dragOver ? "active" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); setFile(e.dataTransfer.files?.[0] ?? null) }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <span className="drop-icon">📄</span>
              <div className="drop-label">Drop your PDF here</div>
              <div className="drop-hint">or click to browse files</div>
            </div>

            {file && (
              <div style={{ marginTop: "0.8rem" }}>
                <div className="file-pill">
                  <span>✓</span>
                  <span>{file.name}</span>
                  <span style={{ opacity: 0.5 }}>· {(file.size / 1024).toFixed(0)} KB</span>
                </div>
              </div>
            )}
          </div>

          {/* JD card */}
          <div className="card">
            <div className="card-header">
              <div className="card-num">02</div>
              <div>
                <div className="card-title">Paste Job Description</div>
                <div className="card-sub">The role you are targeting</div>
              </div>
            </div>

            <label className="jd-label">Job Description</label>
            <textarea
              className="jd-textarea"
              rows={6}
              placeholder="Paste the full job description here — responsibilities, requirements, preferred qualifications..."
              value={jd}
              onChange={(e) => setJD(e.target.value)}
            />

            <button
              className="analyze-btn"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Analyzing…" : "◈  Run Analysis"}
            </button>
          </div>

          {/* Loader */}
          {loading && (
            <div className="loader-wrap">
              <div className="loader-dots">
                <span /><span /><span />
              </div>
              <div className="loader-text">Reading your resume · Matching skills · Building report</div>
            </div>
          )}

          {/* Results */}
          {result && feedback && (
            <>
              {/* ATS Score */}
              <div className="score-banner">
                <div className="score-left">
                  <div className="score-eyebrow">ATS Match Score</div>
                  <div className="score-number" style={{ color: scoreColor }}>
                    {score}<span style={{ fontSize: "2rem", opacity: 0.5 }}>%</span>
                  </div>
                  <div className="score-label" style={{ color: scoreColor }}>{scoreLabel}</div>
                </div>
                <div className="score-bar-wrap">
                  <div className="score-bar-track">
                    <div
                      className="score-bar-fill"
                      style={{ width: `${score}%`, background: scoreColor }}
                    />
                  </div>
                  <div className="score-bar-labels">
                    <span>0</span>
                    <span>Weak · 50 · Partial</span>
                    <span>75 · Strong · 100</span>
                  </div>
                </div>
              </div>

              {/* 2-col grid */}
              <div className="result-grid">

                <div className="result-card">
                  <div className="result-tag tag-green">✓ &nbsp;Matched Skills</div>
                  <div className="result-body">{feedback.MATCHED || "—"}</div>
                </div>

                <div className="result-card">
                  <div className="result-tag tag-red">✕ &nbsp;Missing Skills</div>
                  <div className="result-body">{feedback.MISSING || "—"}</div>
                </div>

                <div className="result-card">
                  <div className="result-tag tag-teal">◈ &nbsp;Suggested Projects</div>
                  <div className="result-body">{feedback.PROJECTS || "—"}</div>
                </div>

                <div className="result-card">
                  <div className="result-tag tag-ink">✦ &nbsp;Professional Summary</div>
                  <div className="result-body">{feedback.SUMMARY || "—"}</div>
                </div>

                <div className="result-card full">
                  <div className="result-tag tag-amber">→ &nbsp;Action Plan</div>
                  <div className="result-body">{feedback.ACTION || "—"}</div>
                </div>

              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-brand">Resume<span>Lens</span> · Career Intelligence</div>
          <div className="footer-meta">AI · FastAPI · Next.js · v1.0.0</div>
        </div>

      </div>
    </>
  )
}