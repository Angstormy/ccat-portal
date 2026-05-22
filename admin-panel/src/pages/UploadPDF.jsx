import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const UploadPDF = () => {
  const [files, setFiles] = useState([]);
  
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Create an array of objects to track the state of each file
    const fileList = selectedFiles.map(file => ({
      file,
      name: file.name.replace('.pdf', ''),
      section: 'ccat-notes-&-practice',
      subject: 'basics-of-big-data-&-artificial-intelligence',
      status: 'pending', // pending, uploading, success, error
      fileId: null
    }));
    setFiles(prev => [...prev, ...fileList]);
  };

  const updateFileDetail = (index, field, value) => {
    const newFiles = [...files];
    newFiles[index][field] = value;
    setFiles(newFiles);
  };

  const uploadSingleFile = async (index) => {
    const fileObj = files[index];
    updateFileDetail(index, 'status', 'uploading');

    try {
      // 1. Upload to Telegram Bot (Requires VITE_BOT_TOKEN and VITE_ADMIN_CHAT_ID in .env)
      const botToken = import.meta.env.VITE_BOT_TOKEN;
      const chatId = import.meta.env.VITE_ADMIN_CHAT_ID;
      
      if (!botToken || !chatId) {
        alert("Please set VITE_BOT_TOKEN and VITE_ADMIN_CHAT_ID in admin-panel/.env");
        updateFileDetail(index, 'status', 'error');
        return;
      }

      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('document', fileObj.file);

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (!data.ok) throw new Error(data.description);

      const telegramFileId = data.result.document.file_id;
      updateFileDetail(index, 'fileId', telegramFileId);

      // 2. Save to Firebase Firestore
      const docId = fileObj.name.toLowerCase().replace(/\s+/g, '-');
      const pdfRef = doc(db, 'sections', fileObj.section, 'subjects', fileObj.subject, 'pdfs', docId);
      
      await setDoc(pdfRef, {
        name: fileObj.name,
        telegram_file_id: telegramFileId,
        downloads: 0,
        uploaded_at: serverTimestamp()
      });

      updateFileDetail(index, 'status', 'success');
    } catch (error) {
      console.error(error);
      updateFileDetail(index, 'status', 'error');
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1 className="text-gradient">Bulk Upload PDFs</h1>
      <p style={{ marginBottom: '24px' }}>Select multiple files to review and categorize them before uploading.</p>
      
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <input 
          type="file" 
          accept="application/pdf"
          multiple
          onChange={handleFileSelect}
          style={{ width: '100%' }}
        />
      </div>

      {files.length > 0 && (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '12px' }}>File Name</th>
                <th style={{ padding: '12px' }}>Section</th>
                <th style={{ padding: '12px' }}>Subject</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {files.map((fileObj, index) => (
                <tr key={index} style={{ borderBottom: '1px solid rgba(102, 252, 241, 0.05)' }}>
                  <td style={{ padding: '12px' }}>
                    <input 
                      type="text" 
                      value={fileObj.name}
                      onChange={(e) => updateFileDetail(index, 'name', e.target.value)}
                      style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px', width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '12px' }}>
                    <input 
                      type="text"
                      value={fileObj.section}
                      onChange={(e) => updateFileDetail(index, 'section', e.target.value)}
                      style={{ padding: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px', width: '100%' }}
                      placeholder="e.g. section-a"
                    />
                  </td>
                  <td style={{ padding: '12px' }}>
                    <input 
                      type="text"
                      value={fileObj.subject}
                      onChange={(e) => updateFileDetail(index, 'subject', e.target.value)}
                      style={{ padding: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px', width: '100%' }}
                      placeholder="e.g. english"
                    />
                  </td>
                  <td style={{ padding: '12px' }}>
                    {fileObj.status === 'pending' && <span style={{ color: 'gray' }}>Pending</span>}
                    {fileObj.status === 'uploading' && <span style={{ color: '#f1c40f' }}>Uploading...</span>}
                    {fileObj.status === 'success' && <span style={{ color: '#2ecc71' }}>✔ Success</span>}
                    {fileObj.status === 'error' && <span style={{ color: '#e74c3c' }}>✖ Error</span>}
                  </td>
                  <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                      onClick={() => uploadSingleFile(index)}
                      disabled={fileObj.status === 'uploading' || fileObj.status === 'success'}
                    >
                      Upload
                    </button>
                    <button 
                      onClick={() => removeFile(index)}
                      style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '1.2rem' }}
                      title="Remove"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
