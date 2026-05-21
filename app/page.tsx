"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Sparkles, UploadCloud, FileText, X, Brain, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

export default function Home() {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const processFiles = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const pdfFiles = Array.from(selectedFiles).filter(file => file.type === "application/pdf");
      if (pdfFiles.length < selectedFiles.length) {
        alert("Xəta: Yalnız PDF formatında olan CV-lər qəbul edilir.");
      }
      setFiles(prev => [...prev, ...pdfFiles]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || files.length === 0) {
      alert("Xəta: Zəhmət olmasa vakansiya mətnini daxil edin və ən azı bir CV yükləyin.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("job_description", jobDescription);
    files.forEach(file => formData.append("file", file));

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Backend server error");
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Xəta: Analiz zamanı problem yarandı. Backend serverinizin işlək olduğundan əmin olun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#050509', color: '#f4f4f5', minHeight: '100vh',
      fontFamily: 'sans-serif', padding: '40px 20px', boxSizing: 'border-box',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: '25%', width: '600px', height: '600px', backgroundColor: 'rgba(14, 165, 233, 0.08)', borderRadius: '50%', filter: 'blur(140px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: '25%', width: '600px', height: '600px', backgroundColor: 'rgba(168, 85, 247, 0.08)', borderRadius: '50%', filter: 'blur(140px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', paddingBottom: '24px', borderBottom: '1px solid #27272a', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '16px', backgroundColor: '#09090b', border: '1px solid #27272a', display: 'flex' }}>
              <Cpu style={{ width: '32px', height: '32px', color: '#38bdf8' }} />
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', color: '#38bdf8', fontWeight: '500', marginBottom: '6px' }}>
                <Sparkles style={{ width: '14px', height: '14px' }} /> Next-Gen Talent Acquisition
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, tracking: '-1px', color: '#ffffff' }}>TalentScout AI</h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(24, 24, 27, 0.5)', border: '1px solid #27272a', padding: '8px 16px', borderRadius: '12px', backdropFilter: 'blur(8px)' }}>
            <Brain style={{ width: '20px', height: '20px', color: '#a855f7' }} />
            <div style={{ fontSize: '14px' }}>
              <span style={{ color: '#71717a', display: 'block', fontSize: '11px' }}>AI Status</span>
              <span style={{ color: '#10b981', fontWeight: '600' }}>Gemini Engine Active</span>
            </div>
          </div>
        </header>

        <div className="main-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: 'rgba(24, 24, 27, 0.4)', border: '1px solid rgba(39, 39, 42, 0.8)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(16px)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '500', color: '#d4d4d8', marginBottom: '14px' }}>
                <FileText style={{ width: '18px', height: '18px', color: '#38bdf8' }} /> Job Description / Vakansiya Öhdəlikləri
              </label>
              <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Vakansiya tələblərini bura yapışdırın..." style={{ width: '100%', height: '180px', backgroundColor: 'rgba(9, 9, 11, 0.6)', border: '1px solid #27272a', borderRadius: '12px', padding: '16px', color: '#e4e4e7', fontSize: '14px', lineHeight: '1.6', resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ backgroundColor: 'rgba(24, 24, 27, 0.4)', border: '1px solid rgba(39, 39, 42, 0.8)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(16px)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '500', color: '#d4d4d8', marginBottom: '14px' }}>
                <UploadCloud style={{ width: '18px', height: '18px', color: '#a855f7' }} /> CV Sənədlərini Sürüşdürüb Buraxın
              </label>
              <input ref={fileInputRef} type="file" multiple accept=".pdf" style={{ display: 'none' }} onChange={handleFileChange} />
              <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} style={{ border: '2px dashed #27272a', borderRadius: '16px', padding: '40px', textAlign: 'center', cursor: 'pointer', backgroundColor: dragActive ? 'rgba(56, 189, 248, 0.05)' : 'rgba(9, 9, 11, 0.4)', borderColor: dragActive ? '#38bdf8' : '#27272a', transition: 'all 0.3s ease' }}>
                <UploadCloud style={{ width: '48px', height: '48px', margin: '0 auto 20px', color: dragActive ? '#38bdf8' : '#52525b' }} />
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#d4d4d8', margin: 0 }}>CV-ləri bura buraxın və ya <span style={{ color: '#38bdf8', textDecoration: 'underline' }}>seçin</span></p>
                <p style={{ fontSize: '12px', color: '#52525b', marginTop: '10px', marginBottom: 0 }}>Yalnız PDF formatı dəstəklənir</p>
              </div>
              {files.length > 0 && (
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid #27272a' }}>
                  {files.map((file, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#09090b', border: '1px solid #27272a', padding: '10px 16px', borderRadius: '12px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                        <FileText style={{ width: '16px', height: '16px', color: '#52525b', flexShrink: 0 }} />
                        <span style={{ color: '#d4d4d8', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{file.name}</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeFile(index); }} style={{ background: 'none', border: 'none', color: '#52525b', cursor: 'pointer', padding: '4px' }}>
                        <X style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={handleAnalyze} disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.5px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? 'rgba(56, 189, 248, 0.4)' : 'linear-gradient(to right, #0284c7, #0ea5e9, #8b5cf6)', color: loading ? '#bae6fd' : '#ffffff', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.5)', transition: 'all 0.3s ease' }}>
              {loading ? "Süni İntellekt Analiz Edir..." : "Süni İntellekt Analizini Başlat"}
            </button>
          </div>

          <div style={{ backgroundColor: 'rgba(24, 24, 27, 0.4)', border: '1px solid rgba(39, 39, 42, 0.8)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#e4e4e7', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>
              <Brain style={{ width: '22px', height: '22px', color: '#38bdf8' }} /> Analiz Hesabatı və Reytinq
            </h2>

            {!result && !loading && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px', border: '1px dashed rgba(39, 39, 42, 0.6)', borderRadius: '12px', backgroundColor: 'rgba(9, 9, 11, 0.3)' }}>
                <Brain style={{ width: '56px', height: '56px', color: '#27272a', marginBottom: '16px' }} />
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#52525b', margin: 0 }}>Sistem sənəd gözləyir</p>
                <p style={{ fontSize: '12px', color: '#3f3f46', marginTop: '6px', marginBottom: 0, maxWidth: '240px' }}>İş təsvirini yapışdırıb CV yüklədikdən sonra məlumatlar bura gələcək.</p>
              </div>
            )}

            {loading && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid rgba(56, 189, 248, 0.2)', borderTopColor: '#38bdf8', animation: 'spin 1s linear infinite' }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#e4e4e7', margin: 0 }}>CV oxunur və Gemini ilə analiz edilir...</p>
                  <p style={{ fontSize: '12px', color: '#52525b', marginTop: '6px', marginBottom: 0, fontFamily: 'monospace' }}>Status: Processing...</p>
                </div>
              </div>
            )}

            {result && (
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ backgroundColor: 'rgba(9, 9, 11, 0.6)', padding: '24px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                    <div>
                      <h3 style={{ fontWeight: '800', color: '#f4f4f5', fontSize: '16px', margin: 0 }}>Ümumi Uyğunluq Reytinqi</h3>
                      <p style={{ fontSize: '12px', color: '#52525b', margin: '2px 0 0 0' }}>Süni intellekt tərəfindən hesablanmışdır</p>
                    </div>
                    <div style={{ backgroundColor: '#0c4a6e', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#7dd3fc', padding: '12px 20px', borderRadius: '16px', fontFamily: 'monospace', fontWeight: '900', fontSize: '24px', boxShadow: '0 0 20px rgba(14,165,233,0.15)' }}>
                      {result.score}%
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px', fontSize: '14px', color: '#a1a1aa', lineHeight: '1.6' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'start', backgroundColor: 'rgba(6, 78, 59, 0.2)', padding: '14px', borderRadius: '8px', border: '1px solid #064e3b' }}>
                      <CheckCircle2 style={{ width: '20px', height: '20px', color: '#34d399', flexShrink: 0 }} />
                      <p style={{ margin: 0 }}><strong style={{ color: '#a7f3d0' }}>Güclü tərəflər:</strong> {result.strengths}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'start', backgroundColor: 'rgba(120, 53, 4, 0.2)', padding: '14px', borderRadius: '8px', border: '1px solid #78350f' }}>
                      <ShieldAlert style={{ width: '20px', height: '20px', color: '#fbbf24', flexShrink: 0 }} />
                      <p style={{ margin: 0 }}><strong style={{ color: '#fde68a' }}>Potensial boşluqlar:</strong> {result.gaps}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .main-grid {
          display: grid;
          gap: 32px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 992px) {
          .main-grid {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }
        @keyframes spin { 
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
}