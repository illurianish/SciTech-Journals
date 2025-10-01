"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/app/(platform)/components/Sidebar";
import { File, Upload, BarChart3, Filter, Trash2, Download, PlusCircle, Save, X, Search, Calendar, Building, DollarSign, ChevronDown, ChevronUp, Sliders, ExternalLink, FileText, Info } from "lucide-react";
import BenchmarkAnalysis from "./components/BenchmarkAnalysis";

export default function OpenBenchmarksPage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [benchmarks, setBenchmarks] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedBenchmark, setSelectedBenchmark] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBenchmarkName, setNewBenchmarkName] = useState("");
  const [newBenchmarkType, setNewBenchmarkType] = useState("property");
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [selectedBenchmarks, setSelectedBenchmarks] = useState([]);
  const [showPropertyModels, setShowPropertyModels] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    propertyType: "all",
    minCapRate: "",
    maxCapRate: "",
    minNOI: "",
    maxNOI: "",
    status: "all"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Sample benchmark data
  useEffect(() => {
    // Simulating data fetch
    const sampleBenchmarks = [
      {
        id: 1,
        name: "Office Portfolio 2023",
        type: "property",
        properties: 12,
        models: 12,
        metrics: {
          capRate: "5.8%",
          noi: "$24.5M",
          irr: "12.4%",
          occupancy: "92%"
        },
        lastUpdated: "2023-12-15",
        status: "active"
      },
      {
        id: 2,
        name: "Multifamily Standards",
        type: "property",
        properties: 18,
        models: 18,
        metrics: {
          capRate: "4.9%",
          noi: "$32.1M",
          irr: "15.2%",
          occupancy: "95%"
        },
        lastUpdated: "2023-11-05",
        status: "active"
      },
      {
        id: 3,
        name: "Retail Properties",
        type: "property",
        properties: 8,
        models: 8,
        metrics: {
          capRate: "6.2%",
          noi: "$18.7M",
          irr: "10.8%",
          occupancy: "88%"
        },
        lastUpdated: "2023-10-22",
        status: "active"
      },
      {
        id: 4,
        name: "Industrial Leases",
        type: "lease",
        properties: 15,
        models: 15,
        metrics: {
          avgTerm: "7.2 years",
          escalation: "3.2%",
          tiBudget: "$45/sqft",
          renewalRate: "78%"
        },
        lastUpdated: "2023-09-18",
        status: "active"
      }
    ];
    
    setBenchmarks(sampleBenchmarks);
  }, []);

  // Sample property models data
  const [propertyModels, setPropertyModels] = useState([
    {
      id: 1,
      name: "One Financial Plaza",
      type: "Office",
      location: "Boston, MA",
      size: "250,000 sq ft",
      purchasePrice: "$85,000,000",
      capRate: "5.8%",
      irr: "12.4%",
      noi: "$4,930,000",
      cashOnCash: "7.2%",
      debtYield: "9.2%",
      occupancy: "93%",
      wault: "4.7 years",
      lastUpdated: "2023-11-20",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Riverside Apartments",
      type: "Multifamily",
      location: "Cambridge, MA",
      size: "180 units",
      purchasePrice: "$62,500,000",
      capRate: "4.7%",
      irr: "14.8%",
      noi: "$2,937,500",
      cashOnCash: "6.4%",
      debtYield: "8.7%",
      occupancy: "96%",
      wault: "1.2 years",
      lastUpdated: "2023-12-05",
      image: "https://images.unsplash.com/photo-1580041065738-e72023775cdc?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Metro Industrial Park",
      type: "Industrial",
      location: "Quincy, MA",
      size: "320,000 sq ft",
      purchasePrice: "$48,000,000",
      capRate: "6.4%",
      irr: "11.7%",
      noi: "$3,072,000",
      cashOnCash: "7.9%",
      debtYield: "10.2%",
      occupancy: "100%",
      wault: "7.2 years",
      lastUpdated: "2023-10-15",
      image: "https://images.unsplash.com/photo-1565610222536-ef125c59f51b?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Retail Commons",
      type: "Retail",
      location: "Newton, MA",
      size: "85,000 sq ft",
      purchasePrice: "$28,500,000",
      capRate: "6.1%",
      irr: "10.5%",
      noi: "$1,738,500",
      cashOnCash: "7.1%",
      debtYield: "9.5%",
      occupancy: "88%",
      wault: "5.3 years",
      lastUpdated: "2023-11-10",
      image: "https://images.unsplash.com/photo-1519123429474-4003e1a1f918?q=80&w=1200&auto=format&fit=crop"
    }
  ]);

  const handleBenchmarkSelect = (benchmark) => {
    setSelectedBenchmark(benchmark);
  };

  const handleCreateBenchmark = () => {
    // Create new benchmark
    const newBenchmark = {
      id: benchmarks.length + 1,
      name: newBenchmarkName,
      type: newBenchmarkType,
      properties: 0,
      models: 0,
      metrics: newBenchmarkType === "property" 
        ? { capRate: "0.0%", noi: "$0", irr: "0.0%", occupancy: "0%" }
        : { avgTerm: "0 years", escalation: "0.0%", tiBudget: "$0/sqft", renewalRate: "0%" },
      lastUpdated: new Date().toISOString().split('T')[0],
      status: "draft"
    };
    
    setBenchmarks([...benchmarks, newBenchmark]);
    setNewBenchmarkName("");
    setShowCreateModal(false);
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowUploadModal(false);
            setUploadProgress(0);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  // Handle view models
  const handleViewModels = () => {
    setShowPropertyModels(true);
  };
  
  // Handle view analysis
  const handleViewAnalysis = () => {
    setShowAnalysis(true);
  };
  
  // Filter properties by search query and filters
  const filteredProperties = propertyModels.filter(property => {
    // Search query filtering
    if (
      searchQuery &&
      !property.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !property.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !property.type.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Type filtering
    if (filterOptions.propertyType !== "all" && property.type !== filterOptions.propertyType) {
      return false;
    }
    
    // Cap rate filtering
    if (filterOptions.minCapRate && parseFloat(property.capRate) < parseFloat(filterOptions.minCapRate)) {
      return false;
    }
    if (filterOptions.maxCapRate && parseFloat(property.capRate) > parseFloat(filterOptions.maxCapRate)) {
      return false;
    }
    
    // NOI filtering
    const noiValue = parseFloat(property.noi.replace(/[^0-9.-]+/g, ""));
    if (filterOptions.minNOI && noiValue < parseFloat(filterOptions.minNOI)) {
      return false;
    }
    if (filterOptions.maxNOI && noiValue > parseFloat(filterOptions.maxNOI)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Benchmark Center</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Benchmark
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Argus Models
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex flex-wrap border-b">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`px-6 py-3 font-medium text-sm flex items-center ${selectedTab === 'overview' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-700 hover:text-gray-900'}`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('property')}
                className={`px-6 py-3 font-medium text-sm flex items-center ${selectedTab === 'property' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-700 hover:text-gray-900'}`}
              >
                <File className="h-4 w-4 mr-2" />
                Property Benchmarks
              </button>
              <button
                onClick={() => setSelectedTab('lease')}
                className={`px-6 py-3 font-medium text-sm flex items-center ${selectedTab === 'lease' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-700 hover:text-gray-900'}`}
              >
                <File className="h-4 w-4 mr-2" />
                Lease Benchmarks
              </button>
              <button
                onClick={() => setShowComparisonModal(true)}
                className={`px-6 py-3 font-medium text-sm flex items-center ${selectedTab === 'comparison' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-700 hover:text-gray-900'}`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Compare Benchmarks
              </button>
            </div>
          </div>
          
          {/* Benchmark Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedTab === 'overview' ? 'All Benchmarks' : 
                   selectedTab === 'property' ? 'Property Benchmarks' : 
                   selectedTab === 'lease' ? 'Lease Benchmarks' : 'Benchmarks'}
                </h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search benchmarks..."
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                    aria-label="Filter benchmarks"
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Properties
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key Metrics
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {benchmarks
                    .filter(b => selectedTab === 'overview' || b.type === selectedTab)
                    .map((benchmark) => (
                    <tr 
                      key={benchmark.id} 
                      className={`hover:bg-blue-50 cursor-pointer ${selectedBenchmark?.id === benchmark.id ? 'bg-blue-50' : ''}`}
                      onClick={() => handleBenchmarkSelect(benchmark)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{benchmark.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          benchmark.type === 'property' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {benchmark.type === 'property' ? 'Property' : 'Lease'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{benchmark.properties} properties</div>
                        <div className="text-sm text-gray-500">{benchmark.models} models</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                          {benchmark.type === 'property' ? (
                            <>
                              <span className="px-2 py-1 text-xs rounded bg-gray-100">Cap Rate: {benchmark.metrics.capRate}</span>
                              <span className="px-2 py-1 text-xs rounded bg-gray-100">NOI: {benchmark.metrics.noi}</span>
                              <span className="px-2 py-1 text-xs rounded bg-gray-100">IRR: {benchmark.metrics.irr}</span>
                            </>
                          ) : (
                            <>
                              <span className="px-2 py-1 text-xs rounded bg-gray-100">Avg Term: {benchmark.metrics.avgTerm}</span>
                              <span className="px-2 py-1 text-xs rounded bg-gray-100">Escalation: {benchmark.metrics.escalation}</span>
                              <span className="px-2 py-1 text-xs rounded bg-gray-100">TI: {benchmark.metrics.tiBudget}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{benchmark.lastUpdated}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          benchmark.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {benchmark.status === 'active' ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          aria-label={`Edit ${benchmark.name} benchmark`}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          aria-label={`Delete ${benchmark.name} benchmark`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Benchmark Detail */}
          {selectedBenchmark && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{selectedBenchmark.name} Details</h2>
                <button 
                  onClick={() => setSelectedBenchmark(null)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close benchmark details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-medium mb-2">Benchmark Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedBenchmark.type === 'property' ? 'Property' : 'Lease'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Properties:</span>
                      <span className="font-medium">{selectedBenchmark.properties}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Models:</span>
                      <span className="font-medium">{selectedBenchmark.models}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{selectedBenchmark.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-medium mb-2">Key Metrics</h3>
                  <div className="space-y-2">
                    {selectedBenchmark.type === 'property' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cap Rate:</span>
                          <span className="font-medium">{selectedBenchmark.metrics.capRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">NOI:</span>
                          <span className="font-medium">{selectedBenchmark.metrics.noi}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IRR:</span>
                          <span className="font-medium">{selectedBenchmark.metrics.irr}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Occupancy:</span>
                          <span className="font-medium">{selectedBenchmark.metrics.occupancy}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Term:</span>
                          <span className="font-medium">{selectedBenchmark.metrics.avgTerm}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Escalation:</span>
                          <span className="font-medium">{selectedBenchmark.metrics.escalation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">TI Budget:</span>
                          <span className="font-medium">{selectedBenchmark.metrics.tiBudget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Renewal Rate:</span>
                          <span className="font-medium">{selectedBenchmark.metrics.renewalRate}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-medium mb-2">Actions</h3>
                  <div className="space-y-3">
                    <button 
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 flex items-center justify-center"
                      aria-label="Add models to benchmark"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add Models
                    </button>
                    <button 
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 flex items-center justify-center"
                      onClick={handleViewModels}
                      aria-label="View property models in benchmark"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      View Models
                    </button>
                    <button 
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 flex items-center justify-center"
                      onClick={handleViewAnalysis}
                      aria-label="View benchmark analysis"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analysis
                    </button>
                    <button 
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 flex items-center justify-center"
                      aria-label="Export benchmark data"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </button>
                    <button 
                      className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-md font-medium hover:bg-red-50 flex items-center justify-center"
                      aria-label="Delete benchmark"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Property List */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Included Properties</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-center py-8">
                    {selectedBenchmark.properties > 0 
                      ? "Property list will be displayed here" 
                      : "No properties added to this benchmark yet."}
                  </p>
                  
                  {selectedBenchmark.properties === 0 && (
                    <div className="text-center mt-4">
                      <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                        aria-label="Add properties to benchmark"
                      >
                        Add Properties
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Import Argus Models</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close upload modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Upload your Argus financial models to create or update benchmarks. 
                  We support .arg, .argus, and Excel exports from Argus.
                </p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-4">
                    Drag and drop your files here, or click to browse
                  </p>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                    onClick={simulateUpload}
                    aria-label="Select files to upload"
                  >
                    Select Files
                  </button>
                </div>
                
                {uploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Uploading files...</span>
                      <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                  onClick={() => setShowUploadModal(false)}
                  aria-label="Cancel upload"
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                  onClick={() => setShowUploadModal(false)}
                  aria-label="Upload selected files"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Benchmark Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Create New Benchmark</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close create benchmark modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="benchmarkName" className="block text-sm font-medium text-gray-700 mb-1">
                  Benchmark Name
                </label>
                <input
                  id="benchmarkName"
                  type="text"
                  value={newBenchmarkName}
                  onChange={(e) => setNewBenchmarkName(e.target.value)}
                  placeholder="Enter benchmark name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="benchmarkType" className="block text-sm font-medium text-gray-700 mb-1">
                  Benchmark Type
                </label>
                <select
                  id="benchmarkType"
                  value={newBenchmarkType}
                  onChange={(e) => setNewBenchmarkType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="property">Property Benchmark</option>
                  <option value="lease">Lease Benchmark</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Property benchmarks focus on asset performance, while lease benchmarks focus on lease terms and conditions.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                  onClick={() => setShowCreateModal(false)}
                  aria-label="Cancel creating benchmark"
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                  onClick={handleCreateBenchmark}
                  disabled={!newBenchmarkName}
                  aria-label="Create new benchmark"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Property Models View */}
      {showPropertyModels && selectedBenchmark && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedBenchmark.name}: Property Models
              </h3>
              <button 
                onClick={() => setShowPropertyModels(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close property models view"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-grow md:max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by property name, location, or type..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center">
                  <button 
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 flex items-center"
                    aria-label="Toggle filter panel"
                  >
                    <Sliders className="h-4 w-4 mr-2" />
                    Filters
                    {showFilterPanel ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                  </button>
                  
                  <button 
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 flex items-center"
                    aria-label="Add new property model"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Property
                  </button>
                  
                  <button 
                    className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 flex items-center"
                    aria-label="Export property data"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
              
              {/* Filter Panel */}
              {showFilterPanel && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Filter Properties</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor="propertyType" className="block text-xs font-medium text-gray-700 mb-1">
                        Property Type
                      </label>
                      <select
                        id="propertyType"
                        value={filterOptions.propertyType}
                        onChange={(e) => setFilterOptions({...filterOptions, propertyType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Types</option>
                        <option value="Office">Office</option>
                        <option value="Multifamily">Multifamily</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Retail">Retail</option>
                        <option value="Mixed-Use">Mixed-Use</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cap Rate Range (%)
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filterOptions.minCapRate}
                          onChange={(e) => setFilterOptions({...filterOptions, minCapRate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filterOptions.maxCapRate}
                          onChange={(e) => setFilterOptions({...filterOptions, maxCapRate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        NOI Range ($)
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filterOptions.minNOI}
                          onChange={(e) => setFilterOptions({...filterOptions, minNOI: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filterOptions.maxNOI}
                          onChange={(e) => setFilterOptions({...filterOptions, maxNOI: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-end">
                      <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 w-full"
                        onClick={() => setFilterOptions({
                          propertyType: "all",
                          minCapRate: "",
                          maxCapRate: "",
                          minNOI: "",
                          maxNOI: "",
                          status: "all"
                        })}
                        aria-label="Reset all filters"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Property Models Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <div key={property.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={property.image} 
                        alt={property.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{property.name}</h4>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {property.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 flex items-center">
                        <Building className="h-4 w-4 mr-1 text-gray-400" />
                        {property.location} • {property.size}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Cap Rate</p>
                          <p className="font-semibold text-gray-900">{property.capRate}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">IRR</p>
                          <p className="font-semibold text-gray-900">{property.irr}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">NOI</p>
                          <p className="font-semibold text-gray-900">{property.noi}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Cash on Cash</p>
                          <p className="font-semibold text-gray-900">{property.cashOnCash}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Updated: {property.lastUpdated}
                        </span>
                        <div className="flex space-x-2">
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800"
                            aria-label="View property details"
                          >
                            <Info className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800"
                            aria-label="View property documents"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800"
                            aria-label="Open in Argus"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredProperties.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Try adjusting your filters or search criteria to find properties.
                  </p>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="text-sm text-gray-500">
                Showing {filteredProperties.length} of {propertyModels.length} property models
              </div>
              <button 
                onClick={() => setShowPropertyModels(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                aria-label="Close property models view"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add the Benchmark Analysis component */}
      {showAnalysis && selectedBenchmark && (
        <BenchmarkAnalysis 
          benchmark={selectedBenchmark}
          onClose={() => setShowAnalysis(false)}
          properties={propertyModels.map(p => ({
            name: p.name,
            type: p.type,
            metrics: {
              capRate: p.capRate,
              noi: p.noi,
              irr: p.irr,
              cashOnCash: p.cashOnCash
            }
          }))}
        />
      )}
    </div>
  );
} 