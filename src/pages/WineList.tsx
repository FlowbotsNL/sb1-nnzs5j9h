import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Filter } from 'lucide-react';

interface Domain {
  id: string;
  name: string;
  region: string;
  description: string;
}

interface Wine {
  id: string;
  domain_id: string;
  name: string;
  type: string;
  year: number;
  description: string;
  price_12: number;
  price_96: number;
}

export default function WineList() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: '',
    domain: '',
    type: ''
  });

  const [uniqueRegions, setUniqueRegions] = useState<string[]>([]);
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Fetch domains
      const { data: domainsData, error: domainsError } = await supabase
        .from('domains')
        .select('*');

      if (domainsError) throw domainsError;

      // Fetch wines
      const { data: winesData, error: winesError } = await supabase
        .from('wines')
        .select('*');

      if (winesError) throw winesError;

      setDomains(domainsData || []);
      setWines(winesData || []);

      // Extract unique regions and types
      const regions = [...new Set(domainsData?.map(d => d.region) || [])];
      const types = [...new Set(winesData?.map(w => w.type) || [])];
      
      setUniqueRegions(regions);
      setUniqueTypes(types);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredDomains = domains.filter(domain => {
    if (filters.region && domain.region !== filters.region) return false;
    if (filters.domain && domain.id !== filters.domain) return false;
    return true;
  });

  const filteredWines = wines.filter(wine => {
    const domain = domains.find(d => d.id === wine.domain_id);
    if (filters.region && domain?.region !== filters.region) return false;
    if (filters.domain && wine.domain_id !== filters.domain) return false;
    if (filters.type && wine.type !== filters.type) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-purple-900" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.region}
            onChange={(e) => setFilters(f => ({ ...f, region: e.target.value }))}
            className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">All Regions</option>
            {uniqueRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>

          <select
            value={filters.domain}
            onChange={(e) => setFilters(f => ({ ...f, domain: e.target.value }))}
            className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">All Domains</option>
            {domains.map(domain => (
              <option key={domain.id} value={domain.id}>{domain.name}</option>
            ))}
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
            className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Wine List */}
      <div className="space-y-8">
        {filteredDomains.map(domain => {
          const domainWines = filteredWines.filter(wine => wine.domain_id === domain.id);
          if (domainWines.length === 0) return null;

          return (
            <div key={domain.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">{domain.name}</h2>
                <p className="text-gray-600">Region: {domain.region}</p>
                <p className="mt-2 text-gray-700">{domain.description}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wine
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price (12 bottles)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price (96 bottles)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {domainWines.map(wine => (
                      <tr key={wine.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {wine.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {wine.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {wine.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {wine.year}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          €{wine.price_12.toFixed(2)}/bottle
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          €{wine.price_96.toFixed(2)}/bottle
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}