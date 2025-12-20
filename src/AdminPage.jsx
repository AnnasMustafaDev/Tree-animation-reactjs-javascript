import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCodeNamePairs, saveConfig, deleteConfig, updateDefaults, getDefaults } from './configData';

const AdminPage = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState([]);
  const [defaults, setDefaults] = useState({ greeting: '', message: '' });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ code: '', name: '', greeting: '', message: '' });
  const [editingCode, setEditingCode] = useState(null);

  useEffect(() => {
    loadConfigs();
    loadDefaults();
  }, []);

  const loadConfigs = () => {
    setConfigs(getAllCodeNamePairs());
  };

  const loadDefaults = () => {
    setDefaults(getDefaults());
  };

  const handleAddNew = () => {
    setFormData({ code: '', name: '', greeting: '', message: '' });
    setEditingCode(null);
    setShowForm(true);
  };

  const handleEdit = (config) => {
    setFormData({
      code: config.code,
      name: config.name,
      greeting: config.greeting,
      message: config.message,
    });
    setEditingCode(config.code);
    setShowForm(true);
  };

  const handleDelete = (code) => {
    if (window.confirm(`Delete ${code}?`)) {
      deleteConfig(code);
      loadConfigs();
    }
  };

  const handleSaveConfig = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      alert('Code and Name are required');
      return;
    }

    saveConfig(
      formData.code,
      formData.name,
      formData.greeting || `Happy Birthday ${formData.name}`,
      formData.message || defaults.message
    );

    loadConfigs();
    setShowForm(false);
  };

  const handleUpdateDefaults = () => {
    updateDefaults(defaults.greeting, defaults.message);
    alert('Defaults updated successfully');
  };

  const testGreeting = (code) => {
    navigate(`/${code}/${encodeURIComponent(getAllCodeNamePairs().find(c => c.code === code)?.name)}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', padding: '2rem' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Quicksand:wght@300;500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Quicksand', sans-serif; background: #0f172a; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#f472b6' }}>🎂 Birthday Admin</h1>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ec4899',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
          }}
        >
          ← Back to Home
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Default Settings */}
        <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ec4899' }}>Default Settings</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Default Greeting:</label>
            <input
              type="text"
              value={defaults.greeting}
              onChange={(e) => setDefaults({ ...defaults, greeting: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0f172a',
                color: '#fff',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                fontSize: '1rem',
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Default Message:</label>
            <textarea
              value={defaults.message}
              onChange={(e) => setDefaults({ ...defaults, message: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0f172a',
                color: '#fff',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                minHeight: '100px',
                fontFamily: 'Quicksand, sans-serif',
              }}
            />
          </div>
          <button
            onClick={handleUpdateDefaults}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#06b6d4',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}
          >
            Save Defaults
          </button>
        </section>

        {/* Codes Management */}
        <section style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#ec4899' }}>Manage Codes</h2>
            <button
              onClick={handleAddNew}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              + Add New Code
            </button>
          </div>

          {/* Configs List */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {configs.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No codes configured yet.</p>
            ) : (
              configs.map((config) => (
                <div
                  key={config.code}
                  style={{
                    padding: '1.5rem',
                    backgroundColor: '#1e293b',
                    borderRadius: '0.75rem',
                    border: '1px solid #334155',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: '#f472b6', marginBottom: '0.25rem' }}>
                        Code: {config.code}
                      </h3>
                      <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Name: {config.name}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => testGreeting(config.code)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#06b6d4',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        Test
                      </button>
                      <button
                        onClick={() => handleEdit(config)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#ec4899',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(config.code)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    Greeting: {config.greeting}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    Message: {config.message.substring(0, 80)}...
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Form Modal */}
        {showForm && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setShowForm(false)}
          >
            <div
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '0.75rem',
                padding: '2rem',
                maxWidth: '500px',
                width: '90%',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ec4899' }}>
                {editingCode ? 'Edit Code' : 'Add New Code'}
              </h2>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Code:</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  disabled={!!editingCode}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: editingCode ? '#0f172a' : '#0f172a',
                    color: '#fff',
                    border: '1px solid #475569',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    opacity: editingCode ? 0.6 : 1,
                  }}
                  placeholder="e.g., 0055"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    border: '1px solid #475569',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                  }}
                  placeholder="e.g., Aisha"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Greeting:</label>
                <input
                  type="text"
                  value={formData.greeting}
                  onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    border: '1px solid #475569',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                  }}
                  placeholder="e.g., Happy Birthday Aisha"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Message:</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    border: '1px solid #475569',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    minHeight: '100px',
                    fontFamily: 'Quicksand, sans-serif',
                  }}
                  placeholder="Custom birthday message..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleSaveConfig}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#6b7280',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
