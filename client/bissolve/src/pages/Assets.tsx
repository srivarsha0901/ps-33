import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, Table, Plus, Trash2, Edit, Save, X, Download, Eye } from 'lucide-react';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tables, setTables] = useState([]);
  const [activeTab, setActiveTab] = useState('files');
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const fileInputRef = useRef(null);

  // File upload handler
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAsset = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result,
          uploadDate: new Date().toLocaleDateString(),
          category: file.type.startsWith('image/') ? 'image' : 'document'
        };
        setAssets(prev => [...prev, newAsset]);
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  };

  // Note management
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'general' });

  const saveNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note = {
        id: Date.now(),
        ...newNote,
        createdDate: new Date().toLocaleDateString()
      };
      setNotes(prev => [...prev, note]);
      setNewNote({ title: '', content: '', category: 'general' });
      setIsCreatingNote(false);
    }
  };

  const updateNote = (id, updatedNote) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updatedNote } : note
    ));
    setEditingNote(null);
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // Table management
  const [newTable, setNewTable] = useState({
    name: '',
    headers: ['Item', 'Price', 'Quantity'],
    rows: [['', '', '']]
  });

  const saveTable = () => {
    if (newTable.name.trim()) {
      const table = {
        id: Date.now(),
        ...newTable,
        createdDate: new Date().toLocaleDateString()
      };
      setTables(prev => [...prev, table]);
      setNewTable({
        name: '',
        headers: ['Item', 'Price', 'Quantity'],
        rows: [['', '', '']]
      });
      setIsCreatingTable(false);
    }
  };

  const addTableRow = () => {
    setNewTable(prev => ({
      ...prev,
      rows: [...prev.rows, new Array(prev.headers.length).fill('')]
    }));
  };

  const updateTableCell = (rowIndex, colIndex, value) => {
    setNewTable(prev => ({
      ...prev,
      rows: prev.rows.map((row, rIdx) =>
        rIdx === rowIndex
          ? row.map((cell, cIdx) => cIdx === colIndex ? value : cell)
          : row
      )
    }));
  };

  const deleteAsset = (id) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const deleteTable = (id) => {
    setTables(prev => prev.filter(table => table.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-800 min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Business Assets Manager</h1>
        <p className="text-slate-300">Manage all your business files, notes, and data tables in one place</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-600 mb-6">
        <button
          onClick={() => setActiveTab('files')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'files'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Files & Images
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'notes'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Notes
        </button>
        <button
          onClick={() => setActiveTab('tables')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'tables'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-4 h-4 inline mr-2" />
          Data Tables
        </button>
      </div>

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div>
          <div className="mb-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Files
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map(asset => (
              <div key={asset.id} className="border border-slate-600 bg-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {asset.category === 'image' ? (
                      <Image className="w-5 h-5 text-green-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-400" />
                    )}
                    <span className="font-medium text-sm truncate text-white">{asset.name}</span>
                  </div>
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {asset.category === 'image' && (
                  <img
                    src={asset.data}
                    alt={asset.name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}

                <div className="text-xs text-slate-400 space-y-1">
                  <div>Size: {formatFileSize(asset.size)}</div>
                  <div>Uploaded: {asset.uploadDate}</div>
                </div>

                <div className="mt-3 flex gap-2">
                  <a
                    href={asset.data}
                    download={asset.name}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>

          {assets.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No files uploaded yet. Click "Upload Files" to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div>
          <div className="mb-6">
            <button
              onClick={() => setIsCreatingNote(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Note
            </button>
          </div>

          {/* Create Note Form */}
          {isCreatingNote && (
            <div className="bg-slate-700 border border-slate-600 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Note Title"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  className="border border-slate-500 bg-slate-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <select
                  value={newNote.category}
                  onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value }))}
                  className="border border-slate-500 bg-slate-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="prices">Prices</option>
                  <option value="suppliers">Suppliers</option>
                  <option value="customers">Customers</option>
                  <option value="inventory">Inventory</option>
                </select>
              </div>
              <textarea
                placeholder="Note Content"
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full border border-slate-500 bg-slate-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveNote}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Note
                </button>
                <button
                  onClick={() => setIsCreatingNote(false)}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Notes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map(note => (
              <div key={note.id} className="border border-slate-600 bg-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-white">{note.title}</h3>
                    <span className="text-xs bg-blue-600 text-blue-100 px-2 py-1 rounded">
                      {note.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingNote(note.id)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-3 whitespace-pre-wrap">{note.content}</p>
                <div className="text-xs text-slate-400">
                  Created: {note.createdDate}
                </div>
              </div>
            ))}
          </div>

          {notes.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notes created yet. Click "Create Note" to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Tables Tab */}
      {activeTab === 'tables' && (
        <div>
          <div className="mb-6">
            <button
              onClick={() => setIsCreatingTable(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
            >
              <Table className="w-5 h-5" />
              Create Table
            </button>
          </div>

          {/* Create Table Form */}
          {isCreatingTable && (
            <div className="bg-slate-700 border border-slate-600 rounded-lg p-6 mb-6">
              <input
                type="text"
                placeholder="Table Name (e.g., Product Prices, Inventory)"
                value={newTable.name}
                onChange={(e) => setNewTable(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-slate-500 bg-slate-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              />

              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-slate-500">
                  <thead>
                    <tr className="bg-slate-600">
                      {newTable.headers.map((header, index) => (
                        <th key={index} className="border border-slate-500 px-3 py-2">
                          <input
                            type="text"
                            value={header}
                            onChange={(e) => setNewTable(prev => ({
                              ...prev,
                              headers: prev.headers.map((h, i) => i === index ? e.target.value : h)
                            }))}
                            className="w-full bg-transparent text-center font-medium text-white"
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {newTable.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="border border-slate-500 px-3 py-2">
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => updateTableCell(rowIndex, colIndex, e.target.value)}
                              className="w-full bg-slate-600 text-center text-white"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={addTableRow}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Add Row
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={saveTable}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Table
                </button>
                <button
                  onClick={() => setIsCreatingTable(false)}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Tables List */}
          <div className="space-y-4">
            {tables.map(table => (
              <div key={table.id} className="border border-slate-600 bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">{table.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteTable(table.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-slate-500">
                    <thead>
                      <tr className="bg-slate-600">
                        {table.headers.map((header, index) => (
                          <th key={index} className="border border-slate-500 px-3 py-2 text-left font-medium text-white">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-600">
                          {row.map((cell, colIndex) => (
                            <td key={colIndex} className="border border-slate-500 px-3 py-2 text-white">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-xs text-slate-400 mt-2">
                  Created: {table.createdDate}
                </div>
              </div>
            ))}
          </div>

          {tables.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Table className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tables created yet. Click "Create Table" to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Assets;