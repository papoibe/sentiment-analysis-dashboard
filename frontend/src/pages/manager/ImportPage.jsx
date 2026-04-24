import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ImportPage.module.css';

// Import CSV — Manager (4 bước stepper)
// Tham khảo: Frontend-Guide.md mục 5 Trang 6 (Import sub-page)
const ImportPage = () => {
  const [step, setStep] = useState(1); // 4 bước: Chọn nguồn → Upload → Xác nhận → Hoàn thành
  const [selectedSource, setSelectedSource] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Xử lý drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.name.endsWith('.csv') || dropped.name.endsWith('.xlsx'))) {
      setFile(dropped);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const steps = ['Chọn nguồn', 'Upload file', 'Xác nhận', 'Hoàn thành'];

  return (
    <div>
      <h1 className={styles.pageTitle}>Import Dữ Liệu</h1>

      {/* Stepper */}
      <div className={styles.stepper}>
        {steps.map((label, i) => (
          <div key={i} className={`${styles.step} ${i + 1 <= step ? styles.activeStep : ''} ${i + 1 < step ? styles.doneStep : ''}`}>
            <div className={styles.stepCircle}>{i + 1 < step ? '✓' : i + 1}</div>
            <span className={styles.stepLabel}>{label}</span>
            {i < steps.length - 1 && <div className={styles.stepLine} />}
          </div>
        ))}
      </div>

      <div className={styles.card}>
        {/* Bước 1: Chọn nguồn */}
        {step === 1 && (
          <div>
            <h2 className={styles.stepTitle}>Chọn nguồn dữ liệu</h2>
            <select
              className={styles.select}
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="">-- Chọn nguồn --</option>
              <option value="google">Google Reviews - Phở Việt</option>
              <option value="facebook">Facebook Reviews - Cafe Saigon</option>
              <option value="new">+ Tạo nguồn mới</option>
            </select>
            <div className={styles.btnRow}>
              <button className={styles.nextBtn} disabled={!selectedSource} onClick={() => setStep(2)}>Tiếp tục</button>
            </div>
          </div>
        )}

        {/* Bước 2: Upload file */}
        {step === 2 && (
          <div>
            <h2 className={styles.stepTitle}>Upload file CSV / Excel</h2>
            <div
              className={`${styles.dropzone} ${dragging ? styles.dragging : ''} ${file ? styles.hasFile : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx" onChange={handleFileSelect} hidden />
              {file ? (
                <div className={styles.fileInfo}>
                  <span className={styles.fileIcon}>📄</span>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>({(file.size / 1024).toFixed(1)} KB)</span>
                  <button className={styles.removeFile} onClick={(e) => { e.stopPropagation(); setFile(null); }}>✕</button>
                </div>
              ) : (
                <>
                  <span className={styles.dropIcon}>📁</span>
                  <p>Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                  <p className={styles.dropHint}>Hỗ trợ CSV, Excel • Tối đa 50MB</p>
                </>
              )}
            </div>
            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>Trở lại</button>
              <button className={styles.nextBtn} disabled={!file} onClick={() => setStep(3)}>Tiếp tục</button>
            </div>
          </div>
        )}

        {/* Bước 3: Xác nhận */}
        {step === 3 && (
          <div>
            <h2 className={styles.stepTitle}>Xác nhận thông tin</h2>
            <div className={styles.confirmGrid}>
              <div className={styles.confirmItem}><span>Nguồn:</span><strong>{selectedSource}</strong></div>
              <div className={styles.confirmItem}><span>File:</span><strong>{file?.name}</strong></div>
              <div className={styles.confirmItem}><span>Kích thước:</span><strong>{file ? (file.size / 1024).toFixed(1) + ' KB' : ''}</strong></div>
            </div>
            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => setStep(2)}>Trở lại</button>
              <button className={styles.nextBtn} onClick={() => setStep(4)}>Xác nhận Import</button>
            </div>
          </div>
        )}

        {/* Bước 4: Hoàn thành */}
        {step === 4 && (
          <div className={styles.doneContainer}>
            <div className={styles.doneIcon}>✅</div>
            <h2>Import thành công!</h2>
            <p>File <strong>{file?.name}</strong> đã được tải lên và đang xử lý.</p>
            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => navigate('/data-sources')}>Về danh sách</button>
              <button className={styles.nextBtn} onClick={() => { setStep(1); setFile(null); setSelectedSource(''); }}>Import thêm</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportPage;
