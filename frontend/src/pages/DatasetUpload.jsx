import React, { useState } from 'react';
import { datasetService } from '../services/api';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export const DatasetUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    setUploadResult(null);
    try {
      const res = await datasetService.uploadDataset(file);
      setUploadResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail?.error || err.response?.data?.detail || 'Dataset upload failed validation');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Dataset Validation & Batch Import</h1>
        <p className="text-xs text-slate-400">Upload CSV or Excel production datasets with automated schema and missing value validation</p>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-slate-800 max-w-xl mx-auto space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
          <Upload size={24} />
        </div>
        <h3 className="text-sm font-semibold text-slate-200">Select Production Dataset File</h3>
        <p className="text-xs text-slate-400">Supported formats: .csv, .xlsx, .xls</p>

        <form onSubmit={handleUpload} className="space-y-4 pt-2">
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
          />

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {uploading ? 'Validating Dataset...' : 'Upload & Validate Dataset'}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs flex items-center gap-2 text-left">
            <AlertCircle size={16} />
            <div>
              <p className="font-bold">Validation Error:</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {uploadResult && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs text-left space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle size={18} />
              Dataset Successfully Validated & Processed!
            </div>
            <p>File Name: {uploadResult.filename}</p>
            <p>Row Count: {uploadResult.row_count} records</p>
            <p>Missing Values Imputed: {uploadResult.missing_values_imputed}</p>
            <p>Duplicate Orders Resolved: {uploadResult.duplicate_orders}</p>
          </div>
        )}
      </div>
    </div>
  );
};
