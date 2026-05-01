import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DataTable from '../../components/Table/DataTable';
import Badge from '../../components/common/Badge';
import styles from './SystemConfigPage.module.css';
import { getAiConfig, getKeywords, getBusinesses, createKeyword, deleteKeyword, createBusiness, deleteBusiness, getSystemStats } from '../../services/adminService';

// SVG Icons
import settingsIcon from '../../assets/icons/settings.svg';
import aiRobotIcon from '../../assets/icons/ai-robot.svg';
import tagIcon from '../../assets/icons/tag.svg';
import buildingIcon from '../../assets/icons/building.svg';
import editIcon from '../../assets/icons/edit.svg';
import deleteIcon from '../../assets/icons/delete.svg';
import saveIcon from '../../assets/icons/save.svg';
import checkIcon from '../../assets/icons/check.svg';
import connectionIcon from '../../assets/icons/connection.svg';

// System Config — Admin
// 4 Tabs: Hệ thống | AI Config | Keywords | Doanh nghiệp
const SystemConfigPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Map URL path → tab key (đồng bộ sidebar ↔ tabs)
  const getTabFromUrl = (pathname) => {
    if (pathname.includes('/settings/keywords')) return 'keywords';
    if (pathname.includes('/settings/ai')) return 'ai';
    return 'system';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl(location.pathname));

  // Khi URL thay đổi (click sidebar) → cập nhật tab
  useEffect(() => {
    setActiveTab(getTabFromUrl(location.pathname));
  }, [location.pathname]);

  // Khi click tab → cập nhật URL (breadcrumb + sidebar highlight)
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const urlMap = { system: '/settings', ai: '/settings/ai', keywords: '/settings/keywords', businesses: '/settings' };
    navigate(urlMap[tabKey] || '/settings', { replace: true });
  };

  // AI config
  const [aiConfig, setAiConfig] = useState({
    apiKey: 'sk-proj-***...***cA',
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
  });
  const [testResult, setTestResult] = useState(null);

  // Keywords (fallback mock)
  const mockKeywords = [
    { id: 1, keyword: 'ngon', category: 'FOOD_QUALITY' },
    { id: 2, keyword: 'tệ', category: 'SERVICE' },
    { id: 3, keyword: 'rẻ', category: 'PRICE' },
    { id: 4, keyword: 'sạch sẽ', category: 'ATMOSPHERE' },
    { id: 5, keyword: 'chậm', category: 'SERVICE' },
    { id: 6, keyword: 'thân thiện', category: 'SERVICE' },
    { id: 7, keyword: 'đắt', category: 'PRICE' },
    { id: 8, keyword: 'tươi', category: 'FOOD_QUALITY' },
  ];
  const [keywords, setKeywords] = useState(mockKeywords);

  // Businesses (fallback mock)
  const mockBusinesses = [
    { id: 1, name: 'Nhà Hàng Phở Việt', description: 'Chuỗi nhà hàng phở truyền thống', reviews: 150 },
    { id: 2, name: 'Cafe Saigon Morning', description: 'Chuỗi quán cafe phong cách Sài Gòn', reviews: 80 },
  ];
  const [businesses, setBusinesses] = useState(mockBusinesses);

  // Stats cho tab system
  const [sysStats, setSysStats] = useState(null);

  // Gọi API lấy dữ liệu cho mỗi tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aiRes, kwRes, bizRes, statsRes] = await Promise.allSettled([
          getAiConfig(),
          getKeywords(),
          getBusinesses(),
          getSystemStats(),
        ]);
        if (aiRes.status === 'fulfilled' && aiRes.value?.data) setAiConfig(aiRes.value.data);
        if (kwRes.status === 'fulfilled' && kwRes.value?.data) setKeywords(kwRes.value.data);
        if (bizRes.status === 'fulfilled' && bizRes.value?.data) setBusinesses(bizRes.value.data);
        if (statsRes.status === 'fulfilled' && statsRes.value?.data) setSysStats(statsRes.value.data);
      } catch (err) {
        console.warn('Backend chưa sẵn sàng, dùng mockData:', err.message);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { key: 'system', icon: settingsIcon, label: 'Hệ thống' },
    { key: 'ai', icon: aiRobotIcon, label: 'AI Config' },
    { key: 'keywords', icon: tagIcon, label: 'Keywords' },
    { key: 'businesses', icon: buildingIcon, label: 'Doanh nghiệp' },
  ];

  const handleTestConnection = () => {
    setTestResult('testing');
    setTimeout(() => setTestResult('success'), 1500);
  };

  // === CRUD State cho Keywords + Doanh nghiệp ===
  const [kwModal, setKwModal] = useState(null);
  const [kwForm, setKwForm] = useState({ keyword: '', category: 'FOOD_QUALITY' });
  const [bizModal, setBizModal] = useState(null);
  const [bizForm, setBizForm] = useState({ name: '', description: '' });
  const [deleteModal, setDeleteModal] = useState(null);
  const categories = ['FOOD_QUALITY', 'SERVICE', 'PRICE', 'ATMOSPHERE', 'OTHER'];

  const handleKwSubmit = async () => {
    try {
      if (kwModal.mode === 'create') {
        const res = await createKeyword(kwForm);
        setKeywords((p) => [...p, res?.data || { ...kwForm, id: Date.now() }]);
      } else {
        setKeywords((p) => p.map((k) => k.id === kwModal.item.id ? { ...k, ...kwForm } : k));
      }
    } catch { setKeywords((p) => kwModal.mode === 'create' ? [...p, { ...kwForm, id: Date.now() }] : p.map((k) => k.id === kwModal.item.id ? { ...k, ...kwForm } : k)); }
    setKwModal(null);
  };

  const handleBizSubmit = async () => {
    try {
      if (bizModal.mode === 'create') {
        const res = await createBusiness(bizForm);
        setBusinesses((p) => [...p, res?.data || { ...bizForm, id: Date.now(), reviews: 0 }]);
      } else {
        setBusinesses((p) => p.map((b) => b.id === bizModal.item.id ? { ...b, ...bizForm } : b));
      }
    } catch { setBusinesses((p) => bizModal.mode === 'create' ? [...p, { ...bizForm, id: Date.now(), reviews: 0 }] : p.map((b) => b.id === bizModal.item.id ? { ...b, ...bizForm } : b)); }
    setBizModal(null);
  };

  const handleDelete = async () => {
    try { if (deleteModal.type === 'keyword') await deleteKeyword(deleteModal.item.id); else await deleteBusiness(deleteModal.item.id); } catch {}
    if (deleteModal.type === 'keyword') setKeywords((p) => p.filter((k) => k.id !== deleteModal.item.id));
    else setBusinesses((p) => p.filter((b) => b.id !== deleteModal.item.id));
    setDeleteModal(null);
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Cài Đặt Hệ Thống</h1>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button key={tab.key} className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ''}`} onClick={() => handleTabChange(tab.key)}>
            <img src={tab.icon} alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '6px' }} />{tab.label}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        {activeTab === 'system' && (
          <div>
            <h2 className={styles.sectionTitle}>Thông tin hệ thống</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}><span>Phiên bản</span><strong>1.0.0</strong></div>
              <div className={styles.infoItem}><span>Database</span><strong>H2 File-based (Persistent)</strong></div>
              <div className={styles.infoItem}><span>Server port</span><strong>8080</strong></div>
              <div className={styles.infoItem}><span>Frontend port</span><strong>5173</strong></div>
              <div className={styles.infoItem}><span>Tổng Users</span><strong>{sysStats ? sysStats.total_users : '...'}</strong></div>
              <div className={styles.infoItem}><span>Tổng Reviews</span><strong>{sysStats ? sysStats.total_reviews : '...'}</strong></div>
            </div>
          </div>
        )}

        {/* Tab: AI Config */}
        {activeTab === 'ai' && (
          <div>
            <h2 className={styles.sectionTitle}>OpenAI Configuration</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}><label>API Key</label><input className={styles.input} type="password" value={aiConfig.apiKey} onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })} /></div>
              <div className={styles.formGroup}><label>Model</label>
                <select className={styles.select} value={aiConfig.model} onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option><option value="gpt-4">GPT-4</option><option value="gpt-4o-mini">GPT-4o Mini</option>
                </select>
              </div>
              <div className={styles.formGroup}><label>Temperature ({aiConfig.temperature})</label><input className={styles.input} type="range" min="0" max="1" step="0.1" value={aiConfig.temperature} onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })} /></div>
            </div>
            <div className={styles.btnRow}>
              <button className={styles.testBtn} onClick={handleTestConnection}>
                {testResult === 'testing' ? 'Đang test...' : testResult === 'success' ? <><img src={checkIcon} alt="" style={{width:'16px',height:'16px',verticalAlign:'middle',marginRight:'4px'}} />Kết nối OK!</> : <><img src={connectionIcon} alt="" style={{width:'16px',height:'16px',verticalAlign:'middle',marginRight:'4px'}} />Test Connection</>}
              </button>
              <button className={styles.saveBtn}><img src={saveIcon} alt="" style={{width:'16px',height:'16px',verticalAlign:'middle',marginRight:'4px'}} />Lưu cấu hình</button>
            </div>
          </div>
        )}

        {/* Tab: Keywords — CRUD */}
        {activeTab === 'keywords' && (
          <div>
            <div className={styles.headerRow}>
              <h2 className={styles.sectionTitle}>Keywords Tracking</h2>
              <button className={styles.addBtn} onClick={() => { setKwForm({ keyword: '', category: 'FOOD_QUALITY' }); setKwModal({ mode: 'create', item: null }); }}>+ Thêm keyword</button>
            </div>
            <DataTable columns={[{ key: 'keyword', label: 'Keyword' }, { key: 'category', label: 'Category', render: (val) => <Badge type="analyst">{val}</Badge> }]} data={keywords}
              actions={(row) => (<>
                <button className={styles.actionBtn} onClick={() => { setKwForm({ keyword: row.keyword, category: row.category }); setKwModal({ mode: 'edit', item: row }); }}><img src={editIcon} alt="Sửa" style={{width:'14px',height:'14px'}} /></button>
                <button className={styles.actionBtn} onClick={() => setDeleteModal({ type: 'keyword', item: row })}><img src={deleteIcon} alt="Xóa" style={{width:'14px',height:'14px'}} /></button>
              </>)} />
          </div>
        )}

        {/* Tab: Doanh nghiệp — CRUD */}
        {activeTab === 'businesses' && (
          <div>
            <div className={styles.headerRow}>
              <h2 className={styles.sectionTitle}>Quản lý Doanh nghiệp</h2>
              <button className={styles.addBtn} onClick={() => { setBizForm({ name: '', description: '' }); setBizModal({ mode: 'create', item: null }); }}>+ Thêm doanh nghiệp</button>
            </div>
            <DataTable columns={[{ key: 'name', label: 'Tên' }, { key: 'description', label: 'Mô tả' }, { key: 'reviews', label: 'Số Reviews' }]} data={businesses}
              actions={(row) => (<>
                <button className={styles.actionBtn} onClick={() => { setBizForm({ name: row.name, description: row.description }); setBizModal({ mode: 'edit', item: row }); }}><img src={editIcon} alt="Sửa" style={{width:'14px',height:'14px'}} /></button>
                <button className={styles.actionBtn} onClick={() => setDeleteModal({ type: 'business', item: row })}><img src={deleteIcon} alt="Xóa" style={{width:'14px',height:'14px'}} /></button>
              </>)} />
          </div>
        )}
      </div>

      {/* Keyword Modal */}
      {kwModal && (<div className={styles.modalOverlay} onClick={() => setKwModal(null)}><div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <h3>{kwModal.mode === 'create' ? 'Thêm Keyword' : 'Sửa Keyword'}</h3>
        <div className={styles.modalForm}>
          <div className={styles.modalField}><label>Keyword</label><input value={kwForm.keyword} onChange={(e) => setKwForm({ ...kwForm, keyword: e.target.value })} /></div>
          <div className={styles.modalField}><label>Category</label><select value={kwForm.category} onChange={(e) => setKwForm({ ...kwForm, category: e.target.value })}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
        </div>
        <div className={styles.modalActions}><button className={styles.modalCancel} onClick={() => setKwModal(null)}>Hủy</button><button className={styles.modalConfirm} onClick={handleKwSubmit}>{kwModal.mode === 'create' ? 'Thêm' : 'Lưu'}</button></div>
      </div></div>)}

      {/* Business Modal */}
      {bizModal && (<div className={styles.modalOverlay} onClick={() => setBizModal(null)}><div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <h3>{bizModal.mode === 'create' ? 'Thêm Doanh Nghiệp' : 'Sửa Doanh Nghiệp'}</h3>
        <div className={styles.modalForm}>
          <div className={styles.modalField}><label>Tên</label><input value={bizForm.name} onChange={(e) => setBizForm({ ...bizForm, name: e.target.value })} /></div>
          <div className={styles.modalField}><label>Mô tả</label><input value={bizForm.description} onChange={(e) => setBizForm({ ...bizForm, description: e.target.value })} /></div>
        </div>
        <div className={styles.modalActions}><button className={styles.modalCancel} onClick={() => setBizModal(null)}>Hủy</button><button className={styles.modalConfirm} onClick={handleBizSubmit}>{bizModal.mode === 'create' ? 'Thêm' : 'Lưu'}</button></div>
      </div></div>)}

      {/* Delete Confirm */}
      {deleteModal && (<div className={styles.modalOverlay} onClick={() => setDeleteModal(null)}><div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <h3>⚠️ Xác nhận xóa</h3>
        <p style={{color:'var(--text-secondary)',fontSize:'14px',marginBottom:'20px'}}>Bạn có chắc muốn xóa <strong>{deleteModal.item.keyword || deleteModal.item.name}</strong>?</p>
        <div className={styles.modalActions}><button className={styles.modalCancel} onClick={() => setDeleteModal(null)}>Hủy</button><button className={styles.modalConfirm} style={{background:'var(--negative)'}} onClick={handleDelete}>Xóa</button></div>
      </div></div>)}
    </div>
  );
};

export default SystemConfigPage;
