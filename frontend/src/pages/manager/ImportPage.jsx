import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ImportPage.module.css';
import { getDataSources, importFile } from '../../services/dataSourceService';

// SVG Icons từ assets/icons
import fileIcon from '../../assets/icons/file.svg';
import folderIcon from '../../assets/icons/folder.svg';
import checkIcon from '../../assets/icons/check.svg';
import closeIcon from '../../assets/icons/close.svg';

// Import CSV — Manager (4 bước stepper + API upload thật)
const ImportPage = () => {
  const [step, setStep] = useState(1); // 4 bước: Chọn nguồn → Upload → Xác nhận → Hoàn thành
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null); // Kết quả từ backend
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Danh sách data sources từ API
  const [dataSources, setDataSources] = useState([]);

  // Gọi API lấy danh sách datasources
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await getDataSources();
        if (res?.data && Array.isArray(res.data)) {
          setDataSources(res.data);
        }
      } catch (err) {
        console.warn('Không lấy được datasources:', err.message);
      }
    };
    fetchSources();
  }, []);

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

  // Bước 3: Gọi API import thật — POST /api/v1/data-sources/:id/import
  const handleImport = async () => {
    setImporting(true);
    setImportError('');
    try {
      const res = await importFile(selectedSourceId, file);
      // Backend trả: { data: { imported_count, failed_count, sentiment_analyzed, keywords_extracted } }
      setImportResult(res?.data || res);
      setStep(4);
    } catch (err) {
      console.error('Import lỗi:', err);
      setImportError(err?.response?.data?.message || 'Import thất bại. Kiểm tra file CSV format.');
    } finally {
      setImporting(false);
    }
  };

  // Tìm tên datasource đã chọn
  const selectedSource = dataSources.find((ds) => String(ds.id) === String(selectedSourceId));

  const steps = ['Chọn nguồn', 'Upload file', 'Xác nhận', 'Hoàn thành'];

  return (
    <div>
      <h1 className={styles.pageTitle}>Import Dữ Liệu</h1>

      {/* Link download CSV mẫu */}
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        📥 <a href="/sample_reviews.csv" download style={{ color: 'var(--primary)' }}>Tải file CSV mẫu</a> để test import
      </p>

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
        {/* Bước 1: Chọn nguồn — lấy từ API */}
        {step === 1 && (
          <div>
            <h2 className={styles.stepTitle}>Chọn nguồn dữ liệu</h2>
            <select
              className={styles.select}
              value={selectedSourceId}
              onChange={(e) => setSelectedSourceId(e.target.value)}
            >
              <option value="">-- Chọn nguồn --</option>
              {dataSources.map((ds) => (
                <option key={ds.id} value={ds.id}>{ds.name} ({ds.type})</option>
              ))}
            </select>
            <div className={styles.btnRow}>
              <button className={styles.nextBtn} disabled={!selectedSourceId} onClick={() => setStep(2)}>Tiếp tục</button>
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
                  <span className={styles.fileIcon}><img src={fileIcon} alt="" style={{ width: '24px', height: '24px' }} /></span>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>({(file.size / 1024).toFixed(1)} KB)</span>
                  <button className={styles.removeFile} onClick={(e) => { e.stopPropagation(); setFile(null); }}><img src={closeIcon} alt="X" style={{ width: '14px', height: '14px' }} /></button>
                </div>
              ) : (
                <>
                  <span className={styles.dropIcon}><img src={folderIcon} alt="" style={{ width: '32px', height: '32px' }} /></span>
                  <p>Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                  <p className={styles.dropHint}>Hỗ trợ CSV, Excel • File cần có cột "Comment"</p>
                </>
              )}
            </div>
            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>Trở lại</button>
              <button className={styles.nextBtn} disabled={!file} onClick={() => setStep(3)}>Tiếp tục</button>
            </div>
          </div>
        )}

        {/* Bước 3: Xác nhận — gọi API thật */}
        {step === 3 && (
          <div>
            <h2 className={styles.stepTitle}>Xác nhận thông tin</h2>
            <div className={styles.confirmGrid}>
              <div className={styles.confirmItem}><span>Nguồn:</span><strong>{selectedSource?.name || selectedSourceId}</strong></div>
              <div className={styles.confirmItem}><span>File:</span><strong>{file?.name}</strong></div>
              <div className={styles.confirmItem}><span>Kích thước:</span><strong>{file ? (file.size / 1024).toFixed(1) + ' KB' : ''}</strong></div>
            </div>
            {importError && <p style={{ color: 'var(--negative)', fontSize: '13px', marginBottom: '12px' }}>{importError}</p>}
            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => setStep(2)}>Trở lại</button>
              <button className={styles.nextBtn} disabled={importing} onClick={handleImport}>
                {importing ? 'Đang import...' : 'Xác nhận Import'}
              </button>
            </div>
          </div>
        )}

        {/* Bước 4: Hoàn thành — hiển thị kết quả từ backend */}
        {step === 4 && (
          <div className={styles.doneContainer}>
            <div className={styles.doneIcon}><img src={checkIcon} alt="Done" style={{ width: '48px', height: '48px' }} /></div>
            <h2>Import thành công!</h2>
            {importResult && (
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <span className={styles.resultValue}>{importResult.imported_count || 0}</span>
                  <span className={styles.resultLabel}>Reviews imported</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultValue}>{importResult.sentiment_analyzed || 0}</span>
                  <span className={styles.resultLabel}>AI analyzed</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultValue}>{importResult.keywords_extracted || 0}</span>
                  <span className={styles.resultLabel}>Keywords extracted</span>
                </div>
                {importResult.failed_count > 0 && (
                  <div className={styles.resultItem} style={{ borderColor: 'var(--negative)' }}>
                    <span className={styles.resultValue} style={{ color: 'var(--negative)' }}>{importResult.failed_count}</span>
                    <span className={styles.resultLabel}>Failed</span>
                  </div>
                )}
              </div>
            )}
            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => navigate('/data-sources')}>Về danh sách</button>
              <button className={styles.nextBtn} onClick={() => { setStep(1); setFile(null); setSelectedSourceId(''); setImportResult(null); }}>Import thêm</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportPage;
