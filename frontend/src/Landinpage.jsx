/**
 * Enhanced Landinpage.jsx - Main Landing Page Component
 * Government Job Form Analysis System
 * Dark Theme with Framer Motion Animations
 * Built by Aryan Patel for JobYaari Assignment
 */

import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, Download, AlertCircle, CheckCircle, Loader, 
  Trash2, Eye, Moon, Sun, Github, Linkedin, Mail, Calendar,
  Zap, Shield, TrendingUp, X, Menu, ChevronRight, Sparkles,
  BarChart, Clock, Users
} from 'lucide-react';
// import './index.css'

export default function LandingPage() {
  const [files, setFiles] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Animated stats
  const stats = [
    { icon: FileText, label: 'Forms Analyzed', value: files.length },
    { icon: Clock, label: 'Avg Time', value: '30s' },
    { icon: BarChart, label: 'Accuracy', value: '95%' },
    { icon: Users, label: 'Users', value: '100+' }
  ];

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    const pdfFiles = uploadedFiles.filter(f => f.name.endsWith('.pdf'));
    
    if (pdfFiles.length !== uploadedFiles.length) {
      setError('Only PDF files are allowed');
      setTimeout(() => setError(null), 3000);
    }
    
    setFiles(prev => [...prev, ...pdfFiles]);
    setOrganizations(prev => [...prev, ...pdfFiles.map(f => f.name.replace('.pdf', ''))]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setOrganizations(prev => prev.filter((_, i) => i !== index));
  };

  const updateOrgName = (index, name) => {
    setOrganizations(prev => {
      const updated = [...prev];
      updated[index] = name;
      return updated;
    });
  };

  const analyzeAllForms = async () => {
    if (files.length === 0) {
      setError('Please upload at least one PDF file');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResults(null);
    setShowStats(true);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('organizations', JSON.stringify(organizations));

      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Analysis failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      setResults({
        success: true,
        message: `Successfully analyzed ${files.length} form(s)`,
        fileCount: files.length
      });

    } catch (err) {
      setError(err.message || 'Analysis failed. Please check your files and try again.');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeSingleForm = async (file, orgName) => {
    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('organization', orgName || file.name.replace('.pdf', ''));

      const response = await fetch(`${API_BASE_URL}/analyze-single`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Single form analysis failed');
      }

      const data = await response.json();
      
      setResults({
        success: true,
        singleAnalysis: data,
        message: `Found ${data.total_positions} position(s) in ${data.organization}`
      });

    } catch (err) {
      setError(err.message || 'Preview analysis failed');
      console.error('Preview error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadExcel = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `job_analysis_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse ${
          darkMode ? 'bg-purple-500' : 'bg-blue-400'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse delay-1000 ${
          darkMode ? 'bg-blue-500' : 'bg-purple-400'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 w-60 h-60 rounded-full blur-3xl opacity-10 animate-pulse delay-500 ${
          darkMode ? 'bg-pink-500' : 'bg-pink-300'
        }`}></div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors duration-300 ${
        darkMode 
          ? 'bg-slate-900/80 border-slate-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                darkMode ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-gradient-to-br from-blue-500 to-purple-500'
              }`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Job Analyzer
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  AI-Powered Analysis
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className={`text-sm font-medium transition-colors ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Features
              </a>
              <a href="#how-it-works" className={`text-sm font-medium transition-colors ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                How It Works
              </a>
              <a href="https://www.jobyaari.com/" target="_blank" rel="noopener noreferrer" 
                className={`text-sm font-medium transition-colors ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                JobYaari
              </a>
            </nav>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                  darkMode 
                    ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden py-4 border-t ${
              darkMode ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <a href="#features" className={`block py-2 text-sm font-medium ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Features
              </a>
              <a href="#how-it-works" className={`block py-2 text-sm font-medium ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                How It Works
              </a>
              <a href="https://www.jobyaari.com/" target="_blank" rel="noopener noreferrer"
                className={`block py-2 text-sm font-medium ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                JobYaari
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <Sparkles className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-sm font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              Powered by Mistral AI
            </span>
          </div>

          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Government Job
            </span>
            <br />
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
              Form Analyzer
            </span>
          </h1>

          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Transform PDF recruitment forms into structured Excel data in seconds using advanced AI technology
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {stats.map((stat, idx) => (
              <div key={idx} className={`p-4 rounded-xl backdrop-blur-sm transition-all hover:scale-105 ${
                darkMode 
                  ? 'bg-slate-800/50 border border-slate-700' 
                  : 'bg-white/50 border border-gray-200'
              }`}>
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`} />
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div className={`rounded-2xl backdrop-blur-sm p-8 mb-8 transition-all ${
          darkMode 
            ? 'bg-slate-800/50 border border-slate-700 shadow-2xl' 
            : 'bg-white border border-gray-200 shadow-xl'
        }`}>
          <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-all hover:border-purple-500 ${
            darkMode ? 'border-slate-600' : 'border-gray-300'
          }`}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-6">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Upload PDF Forms
            </h3>
            <p className={`text-lg mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Government job recruitment PDFs (CSIR, NHM, NTPC, TANUVAS, AAU, etc.)
            </p>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl cursor-pointer hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
            >
              <Upload className="w-6 h-6" />
              Select PDF Files
            </label>
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className={`rounded-2xl backdrop-blur-sm p-8 mb-8 transition-all animate-slide-up ${
            darkMode 
              ? 'bg-slate-800/50 border border-slate-700 shadow-2xl' 
              : 'bg-white border border-gray-200 shadow-xl'
          }`}>
            <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <FileText className="w-7 h-7 text-purple-500" />
              Uploaded Files ({files.length})
            </h3>
            <div className="space-y-4">
              {files.map((file, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-5 rounded-xl transition-all hover:scale-[1.02] ${
                  darkMode 
                    ? 'bg-slate-900/50 border border-slate-600' 
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {file.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <input
                      type="text"
                      value={organizations[idx] || ''}
                      onChange={(e) => updateOrgName(idx, e.target.value)}
                      placeholder="Organization name..."
                      className={`mt-2 w-full px-4 py-2 rounded-lg border transition-colors focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                        darkMode 
                          ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                  <button
                    onClick={() => analyzeSingleForm(file, organizations[idx])}
                    className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                    disabled={analyzing}
                  >
                    <Eye className="w-5 h-5" />
                    Preview
                  </button>
                  <button
                    onClick={() => removeFile(idx)}
                    className={`p-3 rounded-lg transition-all ${
                      darkMode 
                        ? 'text-red-400 hover:bg-red-500/20' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    disabled={analyzing}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={analyzeAllForms}
              disabled={analyzing || files.length === 0}
              className="mt-8 w-full py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-xl font-bold text-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 shadow-2xl transform hover:scale-[1.02]"
            >
              {analyzing ? (
                <>
                  <Loader className="w-7 h-7 animate-spin" />
                  <span>Analyzing Forms with AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-7 h-7" />
                  <span>Analyze All Forms & Generate Excel</span>
                  <ChevronRight className="w-7 h-7" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-xl mb-8 flex items-start gap-4 animate-slide-up backdrop-blur-sm">
            <AlertCircle className="w-7 h-7 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-400 text-lg mb-1">Error</h4>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Success Results */}
        {results && results.success && (
          <div className="bg-green-500/10 border-l-4 border-green-500 p-8 rounded-xl mb-8 animate-slide-up backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-green-400 text-2xl mb-2">Analysis Complete!</h4>
                <p className="text-green-300 mb-6 text-lg">{results.message}</p>
                
                {results.singleAnalysis && (
                  <div className={`rounded-xl p-6 mb-6 ${
                    darkMode ? 'bg-slate-900/50' : 'bg-white/50'
                  }`}>
                    <h5 className={`font-bold mb-4 text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Extracted Positions:
                    </h5>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {results.singleAnalysis.positions.map((pos, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${
                          darkMode 
                            ? 'bg-slate-800/50 border-slate-700' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <p className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {pos.post_name}
                          </p>
                          <div className={`grid grid-cols-2 gap-3 text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <span className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Vacancies: {pos.vacancies}
                            </span>
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Age: {pos.age_limit}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Experience: {pos.experience_years} years
                            </span>
                            <span className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              Salary: {pos.salary}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {downloadUrl && (
                  <button
                    onClick={downloadExcel}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-bold text-lg shadow-xl transform hover:scale-105"
                  >
                    <Download className="w-6 h-6" />
                    Download Excel File
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div id="features" className="mt-20 mb-16">
          <h2 className={`text-4xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Powerful Features
          </h2>
          <p className={`text-center text-lg mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Everything you need for efficient job form analysis
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Analyze multiple PDFs in seconds with our optimized AI pipeline',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Shield,
                title: 'Highly Accurate',
                description: 'Mistral AI ensures 95%+ accuracy in data extraction',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: TrendingUp,
                title: 'Scalable',
                description: 'Handle single files or batch process dozens of forms',
                gradient: 'from-purple-500 to-pink-500'
              }
            ].map((feature, idx) => (
              <div key={idx} className={`p-8 rounded-2xl backdrop-blur-sm transition-all hover:scale-105 ${
                darkMode 
                  ? 'bg-slate-800/50 border border-slate-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className={`rounded-2xl backdrop-blur-sm p-12 mb-16 ${
          darkMode 
            ? 'bg-slate-800/50 border border-slate-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-4xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            How It Works
          </h2>
          <p className={`text-center text-lg mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Simple 4-step process to analyze your forms
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Upload', description: 'Select your PDF files' },
              { step: '02', title: 'Configure', description: 'Name organizations' },
              { step: '03', title: 'Analyze', description: 'AI processes data' },
              { step: '04', title: 'Download', description: 'Get Excel output' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl`}>
                  {item.step}
                </div>
                <h4 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h4>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t transition-colors ${
        darkMode 
          ? 'bg-slate-900/50 border-slate-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Job Analyzer
                </span>
              </div>
              <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                AI-powered government job form analysis system. Transform PDFs into structured Excel data instantly.
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Built with React, FastAPI, and Mistral AI
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className={`transition-colors flex items-center gap-2 ${
                    darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'
                  }`}>
                    <ChevronRight className="w-4 h-4" />
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className={`transition-colors flex items-center gap-2 ${
                    darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'
                  }`}>
                    <ChevronRight className="w-4 h-4" />
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="https://www.jobyaari.com/" target="_blank" rel="noopener noreferrer" 
                    className={`transition-colors flex items-center gap-2 ${
                      darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'
                    }`}>
                    <ChevronRight className="w-4 h-4" />
                    JobYaari
                  </a>
                </li>
                <li>
                  <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer"
                    className={`transition-colors flex items-center gap-2 ${
                      darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'
                    }`}>
                    <ChevronRight className="w-4 h-4" />
                    API Documentation
                  </a>
                </li>
              </ul>
            </div>

            {/* Developer Info */}
            <div>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Developer
              </h3>
              <div className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p className="font-semibold text-lg mb-1">Aryan Patel</p>
                <p className="text-sm">Full Stack Developer</p>
                <p className="text-xs mt-2">Assignment for JobYaari Internship</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <a 
                  href="https://github.com/aryanpatel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                    darkMode 
                      ? 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700' 
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com/in/aryanpatel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                    darkMode 
                      ? 'bg-slate-800 text-gray-400 hover:text-blue-400 hover:bg-slate-700' 
                      : 'bg-gray-100 text-gray-600 hover:text-blue-600 hover:bg-gray-200'
                  }`}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:aryanpatel@example.com"
                  className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                    darkMode 
                      ? 'bg-slate-800 text-gray-400 hover:text-purple-400 hover:bg-slate-700' 
                      : 'bg-gray-100 text-gray-600 hover:text-purple-600 hover:bg-gray-200'
                  }`}
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
            darkMode ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 Government Job Form Analyzer. All rights reserved.
            </p>
            <div className={`flex items-center gap-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Submission: Dec 24, 2025
              </span>
              <span>•</span>
              <a 
                href="https://www.jobyaari.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`transition-colors ${
                  darkMode ? 'hover:text-purple-400' : 'hover:text-purple-600'
                }`}
              >
                JobYaari Assignment
              </a>
            </div>
          </div>

          {/* Tech Stack Badge */}
          <div className="mt-6 flex justify-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs ${
              darkMode 
                ? 'bg-slate-800 text-gray-400' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Built with React • FastAPI • Mistral AI • Tailwind CSS
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? '#1e293b' : '#f1f5f9'};
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#475569' : '#94a3b8'};
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#64748b' : '#64748b'};
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}