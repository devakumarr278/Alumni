import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const AlumniActivityAnalytics = () => {
  const [filter, setFilter] = useState('overall');
  const [batchFilter, setBatchFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('month');
  const [alumniData, setAlumniData] = useState([]);
  const [hover, setHover] = useState(null);

  // Mock data for alumni activity
  const mockAlumniData = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      batch: 2015,
      department: "CSE",
      avgMentorships: 8,
      feedback: 9,
      avgTimeSpent: 7,
      impactScore: 8.1,
      initials: "SJ"
    },
    {
      id: 2,
      name: "Prof. Rajesh Kumar",
      batch: 2010,
      department: "ECE",
      avgMentorships: 9,
      feedback: 8,
      avgTimeSpent: 8,
      impactScore: 8.3,
      initials: "RK"
    },
    {
      id: 3,
      name: "Ms. Priya Sharma",
      batch: 2018,
      department: "EEE",
      avgMentorships: 6,
      feedback: 7,
      avgTimeSpent: 5,
      impactScore: 6.1,
      initials: "PS"
    },
    {
      id: 4,
      name: "Mr. Amit Verma",
      batch: 2012,
      department: "MECH",
      avgMentorships: 7,
      feedback: 6,
      avgTimeSpent: 6,
      impactScore: 6.5,
      initials: "AV"
    },
    {
      id: 5,
      name: "Dr. Emily Chen",
      batch: 2017,
      department: "CSE",
      avgMentorships: 8,
      feedback: 9,
      avgTimeSpent: 7,
      impactScore: 8.1,
      initials: "EC"
    },
    {
      id: 6,
      name: "Mr. David Wilson",
      batch: 2013,
      department: "ECE",
      avgMentorships: 5,
      feedback: 6,
      avgTimeSpent: 4,
      impactScore: 5.1,
      initials: "DW"
    },
    {
      id: 7,
      name: "Ms. Sophia Rodriguez",
      batch: 2019,
      department: "EEE",
      avgMentorships: 4,
      feedback: 5,
      avgTimeSpent: 3,
      impactScore: 3.9,
      initials: "SR"
    },
    {
      id: 8,
      name: "Dr. Michael Brown",
      batch: 2011,
      department: "MECH",
      avgMentorships: 9,
      feedback: 8,
      avgTimeSpent: 9,
      impactScore: 8.7,
      initials: "MB"
    },
    {
      id: 9,
      name: "Ms. Olivia Parker",
      batch: 2016,
      department: "CSE",
      avgMentorships: 6,
      feedback: 7,
      avgTimeSpent: 5,
      impactScore: 6.1,
      initials: "OP"
    },
    {
      id: 10,
      name: "Prof. James Anderson",
      batch: 2014,
      department: "ECE",
      avgMentorships: 7,
      feedback: 8,
      avgTimeSpent: 6,
      impactScore: 7.1,
      initials: "JA"
    }
  ];

  // Initialize alumni data
  useEffect(() => {
    setAlumniData(mockAlumniData);
  }, []);

  // Gradual data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAlumniData(prev =>
        prev.map(a => {
          const newMentorships = Math.max(
            1,
            a.avgMentorships + (Math.random() - 0.5) * 0.6
          );

          const newTime = Math.max(
            1,
            a.avgTimeSpent + (Math.random() - 0.5) * 0.5
          );

          const newFeedback = Math.min(
            10,
            Math.max(6, a.feedback + (Math.random() - 0.5) * 0.3)
          );

          const impact =
            newMentorships * 0.5 +
            newTime * 0.3 +
            newFeedback * 0.2;

          return {
            ...a,
            avgMentorships: +newMentorships.toFixed(2),
            avgTimeSpent: +newTime.toFixed(2),
            feedback: +newFeedback.toFixed(2),
            impactScore: +impact.toFixed(2),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Top performer calculation
  const topPerformer = useMemo(() => {
    if (alumniData.length === 0) return null;
    return alumniData.reduce((max, curr) =>
      curr.impactScore > max.impactScore ? curr : max
    );
  }, [alumniData]);

  // Filter alumni data based on selected filters
  const filteredAlumniData = useMemo(() => {
    return alumniData.filter(alumni => {
      if (!alumni) return false;
      if (batchFilter !== 'all' && alumni.batch !== parseInt(batchFilter)) return false;
      if (departmentFilter !== 'all' && alumni.department !== departmentFilter) return false;
      return true;
    });
  }, [alumniData, batchFilter, departmentFilter]);

  // Custom bar with avatar
  const CustomBar = (props) => {
    const { x, y, width, height, payload } = props;

    if (!payload) return null;

    const isTop = payload.id === topPerformer?.id;

    const deptColors = {
      CSE: "#6366f1",
      ECE: "#22c55e",
      MECH: "#f97316",
      EEE: "#f59e0b"
    };

    // Fixed gradient ID mismatch - using proper capitalization
    const barFill =
      payload.id === topPerformer?.id
        ? "url(#topGradient)"
        : payload.department
          ? `url(#${payload.department}Gradient)`
          : "#6366f1";

    return (
      <g>
        {/* BAR */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={14}
          ry={14}
          fill={barFill}
          style={{
            filter: isTop ? "drop-shadow(0px 0px 10px gold)" : "none"
          }}
        />

        {/* 👑 TOP PERFORMER */}
        {isTop && (
          <text
            x={x + width / 2}
            y={y - 42}
            textAnchor="middle"
            fontSize="18"
          >
            👑
          </text>
        )}

        {/* AVATAR */}
        <circle
          cx={x + width / 2}
          cy={y - 20}
          r={16}
          fill={deptColors[payload.department]}
          stroke={isTop ? "gold" : "white"}
          strokeWidth={isTop ? 3 : 2}
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setHover(payload)}
          onMouseLeave={() => setHover(null)}
        />

        {/* INITIALS */}
        <text
          x={x + width / 2}
          y={y - 16}
          textAnchor="middle"
          fill="#fff"
          fontWeight="700"
          fontSize="12"
          pointerEvents="none"
        >
          {payload.initials}
        </text>
      </g>
    );
  };

  // Unique batches and departments for filters
  const batches = [...new Set(mockAlumniData.map(a => a.batch))].sort();
  const departments = [...new Set(mockAlumniData.map(a => a.department))].sort();

  return (
    <div className="analytics-page">
      {/* Page Header */}
      <div className="analytics-header">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Alumni Activity Analytics</h2>
            <p className="text-gray-600 mt-1">Real-time insights into alumni engagement and mentorship</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-50 px-3 py-1 rounded-full">
              <span className="text-indigo-700 font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-gray-700 font-medium">Filters:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="overall">Overall</option>
              <option value="batch">Batch</option>
              <option value="department">Department</option>
              <option value="month">Time Period</option>
            </select>
          </div>
          
          {filter === 'batch' && (
            <select 
              value={batchFilter} 
              onChange={(e) => setBatchFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Batches</option>
              {batches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
          )}
          
          {filter === 'department' && (
            <select 
              value={departmentFilter} 
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          )}
          
          {filter === 'month' && (
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          )}
          
          <div className="ml-auto flex items-center">
            <div className="flex items-center text-red-500">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              <span className="font-medium">Live Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Container */}
      <div className="chart-wrapper bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="chart-container" style={{ height: '450px' }}>
          {filteredAlumniData && filteredAlumniData.length > 0 ? (
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredAlumniData}
                  barSize={48}
                  barCategoryGap="35%"
                  barGap={12}
                  margin={{ top: 60, left: 20, right: 20, bottom: 40 }}
                >
                  <defs>
                    {/* Top Performer */}
                    <linearGradient id="topGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="50%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#fb923c" />
                    </linearGradient>

                    {/* Department Gradients with proper capitalization */}
                    <linearGradient id="CSEGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>

                    <linearGradient id="ECEGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>

                    <linearGradient id="MECHGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fb923c" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>

                    <linearGradient id="EEEGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fde047" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>

                  <XAxis 
                    dataKey="name" 
                    interval={0}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    height={70}
                    angle={-45}
                    textAnchor="end"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    tickCount={6} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  
                  <Tooltip />

                  <Bar
                    dataKey="impactScore"
                    shape={<CustomBar />}
                    animationDuration={900}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No data available for the selected filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="summary-card border border-gray-200">
          <div className="text-gray-500 text-sm">Total Alumni</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">248</div>
          <div className="text-green-500 text-sm mt-1">↑ 12% from last month</div>
        </div>
        <div className="summary-card border border-gray-200">
          <div className="text-gray-500 text-sm">Avg. Engagement</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">7.8/10</div>
          <div className="text-green-500 text-sm mt-1">↑ 2.1 points</div>
        </div>
        <div className="summary-card border border-gray-200">
          <div className="text-gray-500 text-sm">Top Performer</div>
          <div className="text-xl font-bold text-gray-900 mt-1 truncate">
            {topPerformer ? topPerformer.name : "Calculating..."}
          </div>
          <div className="text-indigo-500 text-sm mt-1">🏆 Rank #1</div>
        </div>
      </div>

      {/* Avatar hover tooltip */}
      {hover && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          border: '1px solid #e2e8f0',
          maxWidth: '300px',
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: hover.department === "CSE" ? "linear-gradient(135deg, #6366f1, #4f46e5)" : 
                         hover.department === "ECE" ? "linear-gradient(135deg, #22c55e, #16a34a)" : 
                         hover.department === "MECH" ? "linear-gradient(135deg, #f97316, #ea580c)" : 
                         hover.department === "EEE" ? "linear-gradient(135deg, #f59e0b, #d97706)" : "#60a5fa",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              marginRight: '12px'
            }}>
              {hover.initials}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>
                {hover.name}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                {hover.department} • {hover.batch}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Impact</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>
                {hover.impactScore}/10
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Mentorships</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>
                {hover.avgMentorships}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Time</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>
                {hover.avgTimeSpent} hrs
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Feedback</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>
                {hover.feedback}/10
              </div>
            </div>
          </div>
          
          {hover.id === topPerformer?.id && (
            <div style={{ 
              marginTop: '12px', 
              padding: '8px', 
              background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', 
              borderRadius: '6px', 
              textAlign: 'center', 
              fontWeight: 'bold', 
              color: '#d97706' 
            }}>
              👑 TOP PERFORMER
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        /* Page Layout */
        .analytics-page {
          padding: 24px 32px;
          background: #f1f5f9;
          min-height: 100vh;
        }

        /* Header Card (Title Section) */
        .analytics-header {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        /* Filter Bar */
        .filter-bar {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        /* Analytics Container */
        .chart-wrapper {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 20px;
          padding: 30px 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        /* Summary Cards */
        .summary-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .summary-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
};

export default AlumniActivityAnalytics;