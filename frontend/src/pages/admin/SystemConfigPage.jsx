import { useState } from 'react';
import DataTable from '../../components/Table/DataTable';
import Badge from '../../components/common/Badge';
import styles from './SystemConfigPage.module.css';

// System Config — Admin
// Tham khảo: Frontend-Guide.md Trang 11
// 4 Tabs: Hệ thống | AI Config | Keywords | Doanh nghiệp
const SystemConfigPage = () => {
  const [activeTab, setActiveTab] = useState('system');

  // Mock AI config
  const [aiConfig, setAiConfig] = useState({
    apiKey: 'sk-proj-***...***cA',
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
  });
  const [testResult, setTestResult] = useState(null);

  // Mock keywords
  const [keywords] = useState([
    { id: 1, keyword: 'ngon', category: 'FOOD_QUALITY' },
    { id: 2, keyword: 'tệ', category: 'SERVICE' },
    { id: 3, keyword: 'rẻ', category: 'PRICE' },
    { id: 4, keyword: 'sạch sẽ', category: 'ATMOSPHERE' },
    { id: 5, keyword: 'chậm', category: 'SERVICE' },
    { id: 6, keyword: 'thân thiện', category: 'SERVICE' },
    { id: 7, keyword: 'đắt', category: 'PRICE' },
    { id: 8, keyword: 'tươi', category: 'FOOD_QUALITY' },
  ]);

  // Mock businesses
  const [businesses] = useState([
    { id: 1, name: 'Nhà Hàng Phở Việt', description: 'Chuỗi nhà hàng phở truyền thống', reviews: 150 },
    { id: 2, name: 'Cafe Saigon Morning', description: 'Chuỗi quán cafe phong cách Sài Gòn', reviews: 80 },
  ]);

  const tabs = [
    { key: 'system', label: '⚙️ Hệ thống' },
    { key: 'ai', label: '🤖 AI Config' },
    { key: 'keywords', label: '🏷️ Keywords' },
    { key: 'businesses', label: '🏢 Doanh nghiệp' },
  ];

  const handleTestConnection = () => {
    setTestResult('testing');
    setTimeout(() => setTestResult('success'), 1500);
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Cài Đặt Hệ Thống</h1>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >{tab.label}</button>
        ))}
      </div>

      <div className={styles.card}>
        {/* Tab: Hệ thống */}
        {activeTab === 'system' && (
          <div>
            <h2 className={styles.sectionTitle}>Thông tin hệ thống</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}><span>Phiên bản</span><strong>1.0.0</strong></div>
              <div className={styles.infoItem}><span>Database</span><strong>H2 In-Memory</strong></div>
              <div className={styles.infoItem}><span>Server port</span><strong>8080</strong></div>
              <div className={styles.infoItem}><span>Frontend port</span><strong>5173</strong></div>
              <div className={styles.infoItem}><span>Tổng Users</span><strong>3</strong></div>
              <div className={styles.infoItem}><span>Tổng Reviews</span><strong>20</strong></div>
            </div>
          </div>
        )}

        {/* Tab: AI Config */}
        {activeTab === 'ai' && (
          <div>
            <h2 className={styles.sectionTitle}>OpenAI Configuration</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>API Key</label>
                <input className={styles.input} type="password" value={aiConfig.apiKey}
                  onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>Model</label>
                <select className={styles.select} value={aiConfig.model}
                  onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Temperature ({aiConfig.temperature})</label>
                <input className={styles.input} type="range" min="0" max="1" step="0.1"
                  value={aiConfig.temperature}
                  onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })} />
              </div>
            </div>
            <div className={styles.btnRow}>
              <button className={styles.testBtn} onClick={handleTestConnection}>
                {testResult === 'testing' ? '⏳ Đang test...' : testResult === 'success' ? '✅ Kết nối OK!' : '🔌 Test Connection'}
              </button>
              <button className={styles.saveBtn}>💾 Lưu cấu hình</button>
            </div>
          </div>
        )}

        {/* Tab: Keywords */}
        {activeTab === 'keywords' && (
          <div>
            <div className={styles.headerRow}>
              <h2 className={styles.sectionTitle}>Keywords Tracking</h2>
              <button className={styles.addBtn}>+ Thêm keyword</button>
            </div>
            <DataTable
              columns={[
                { key: 'keyword', label: 'Keyword' },
                { key: 'category', label: 'Category', render: (val) => <Badge type="analyst">{val}</Badge> },
              ]}
              data={keywords}
              actions={() => (
                <>
                  <button className={styles.actionBtn}>✏️</button>
                  <button className={styles.actionBtn}>🗑</button>
                </>
              )}
            />
          </div>
        )}

        {/* Tab: Doanh nghiệp */}
        {activeTab === 'businesses' && (
          <div>
            <div className={styles.headerRow}>
              <h2 className={styles.sectionTitle}>Quản lý Doanh nghiệp</h2>
              <button className={styles.addBtn}>+ Thêm doanh nghiệp</button>
            </div>
            <DataTable
              columns={[
                { key: 'name', label: 'Tên' },
                { key: 'description', label: 'Mô tả' },
                { key: 'reviews', label: 'Số Reviews' },
              ]}
              data={businesses}
              actions={() => (
                <>
                  <button className={styles.actionBtn}>✏️</button>
                  <button className={styles.actionBtn}>🗑</button>
                </>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemConfigPage;
