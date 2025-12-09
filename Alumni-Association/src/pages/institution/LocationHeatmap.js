import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../utils/api';

const LocationHeatmap = () => {
  const [timeRange, setTimeRange] = useState('all');
  const [locationData, setLocationData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const fetchLocationData = useCallback(async () => {
    try {
      const response = await api.get(`/institution/analytics/location-heatmap?timeRange=${timeRange}`);
      
      if (response.data.success) {
        // Add dummy coordinates for demonstration
        const dataWithCoords = response.data.data.map((item, index) => ({
          ...item,
          // For demo purposes, we'll assign some dummy coordinates
          // based on the index
          lat: 20 + (index * 5),
          lng: -100 + (index * 15)
        }));
        
        setLocationData(dataWithCoords);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      // Fallback to mock data if API fails
      const mockData = [
        { region: 'Bangalore', country: 'India', alumniCount: 125, lat: 12.9716, lng: 77.5946 },
        { region: 'Hyderabad', country: 'India', alumniCount: 98, lat: 17.3850, lng: 78.4867 },
        { region: 'Chennai', country: 'India', alumniCount: 87, lat: 13.0827, lng: 80.2707 },
        { region: 'Mumbai', country: 'India', alumniCount: 110, lat: 19.0760, lng: 72.8777 },
        { region: 'Delhi', country: 'India', alumniCount: 95, lat: 28.6139, lng: 77.2090 },
        { region: 'San Francisco', country: 'USA', alumniCount: 65, lat: 37.7749, lng: -122.4194 },
        { region: 'New York', country: 'USA', alumniCount: 58, lat: 40.7128, lng: -74.0060 },
        { region: 'London', country: 'UK', alumniCount: 42, lat: 51.5074, lng: -0.1278 },
        { region: 'Singapore', country: 'Singapore', alumniCount: 38, lat: 1.3521, lng: 103.8198 },
        { region: 'Sydney', country: 'Australia', alumniCount: 32, lat: -33.8688, lng: 151.2093 }
      ];
      
      setLocationData(mockData);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchLocationData();
  }, [fetchLocationData]);

  // Simple heatmap visualization using CSS
  const getMaxCount = () => {
    return Math.max(...locationData.map(loc => loc.alumniCount), 1);
  };

  const getHeatLevel = (count) => {
    const max = getMaxCount();
    const ratio = count / max;
    
    if (ratio > 0.8) return 'bg-red-500';
    if (ratio > 0.6) return 'bg-orange-500';
    if (ratio > 0.4) return 'bg-yellow-500';
    if (ratio > 0.2) return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-teal-50 to-cyan-50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-teal-100"
      >
        <h1 className="text-2xl font-bold text-gray-800">Alumni Location Heatmap</h1>
        <p className="text-gray-700 mt-1">Geographic distribution of alumni worldwide</p>
      </motion.div>

      {/* Time Range Filter */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Button
            variant="outline"
            onClick={() => setTimeRange('monthly')}
            className={`${
              timeRange === 'monthly'
                ? 'bg-teal-100 text-teal-800 border-teal-200'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } rounded-r-none`}
          >
            Monthly
          </Button>
          <Button
            variant="outline"
            onClick={() => setTimeRange('quarterly')}
            className={`${
              timeRange === 'quarterly'
                ? 'bg-teal-100 text-teal-800 border-teal-200'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } rounded-none`}
          >
            Quarterly
          </Button>
          <Button
            variant="outline"
            onClick={() => setTimeRange('yearly')}
            className={`${
              timeRange === 'yearly'
                ? 'bg-teal-100 text-teal-800 border-teal-200'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } rounded-none`}
          >
            Yearly
          </Button>
          <Button
            variant="outline"
            onClick={() => setTimeRange('all')}
            className={`${
              timeRange === 'all'
                ? 'bg-teal-100 text-teal-800 border-teal-200'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } rounded-l-none`}
          >
            All Time
          </Button>
        </div>
      </div>

      {/* World Map Visualization */}
      <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Global Alumni Distribution</h3>
        <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden">
          {/* Simplified world map representation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Continents representation */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/3 bg-green-200/30 rounded-full"></div>
              <div className="absolute top-1/3 left-1/6 w-1/4 h-1/4 bg-green-200/30 rounded-full"></div>
              <div className="absolute top-1/2 left-2/3 w-1/3 h-1/4 bg-green-200/30 rounded-full"></div>
              
              {/* Alumni location markers */}
              {locationData.map((loc, index) => {
                // Simple positioning based on latitude and longitude
                const top = `${50 - (loc.lat / 180) * 100}%`;
                const left = `${50 + (loc.lng / 360) * 100}%`;
                
                return (
                  <div
                    key={index}
                    className={`absolute w-4 h-4 rounded-full ${getHeatLevel(loc.alumniCount)} border-2 border-white cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 hover:z-10`}
                    style={{ top, left }}
                    onClick={() => setSelectedRegion(selectedRegion === loc.region ? null : loc.region)}
                    title={`${loc.region}, ${loc.country}: ${loc.alumniCount} alumni`}
                  >
                    {selectedRegion === loc.region && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {loc.region}: {loc.alumniCount}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Alumni Density</h4>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-600">Low</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-600">Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-600">High</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-600">Very High</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-600">Highest</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Location Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Regions */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Alumni Regions</h3>
          <div className="space-y-3">
            {locationData
              .sort((a, b) => b.alumniCount - a.alumniCount)
              .slice(0, 5)
              .map((loc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getHeatLevel(loc.alumniCount)} mr-3`}></div>
                    <div>
                      <p className="font-medium text-gray-800">{loc.region}</p>
                      <p className="text-sm text-gray-600">{loc.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{loc.alumniCount}</p>
                    <p className="text-xs text-gray-600">alumni</p>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Regional Distribution */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Regional Distribution</h3>
          <div className="space-y-4">
            {Object.entries(locationData
              .reduce((acc, loc) => {
                const country = loc.country;
                if (!acc[country]) {
                  acc[country] = { count: 0, regions: [] };
                }
                acc[country].count += loc.alumniCount;
                acc[country].regions.push(loc);
                return acc;
              }, {}))
              .slice(0, 5)
              .map(([country, data], index) => (
                <div key={index} className="p-3 bg-white/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">{country}</h4>
                    <span className="text-sm font-bold text-gray-800">{data.count}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {data.regions.slice(0, 3).map((region, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {region.region} ({region.alumniCount})
                      </span>
                    ))}
                    {data.regions.length > 3 && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        +{data.regions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Detailed Location Table */}
      <Card className="bg-gradient-to-r from-cyan-50 to-teal-50 backdrop-blur-lg border border-cyan-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Detailed Location Data</h3>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <i className="fas fa-download mr-2"></i>Export Data
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Alumni Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Percentage</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              {locationData
                .sort((a, b) => b.alumniCount - a.alumniCount)
                .map((loc, index) => {
                  const total = locationData.reduce((sum, l) => sum + l.alumniCount, 0);
                  const percentage = ((loc.alumniCount / total) * 100).toFixed(1);
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{loc.region}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{loc.country}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{loc.alumniCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{percentage}%</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LocationHeatmap;