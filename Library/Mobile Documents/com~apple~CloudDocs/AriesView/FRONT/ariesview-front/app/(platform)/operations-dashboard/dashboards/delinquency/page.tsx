'use client';

import { useState } from 'react';
import ChartComponent from '../../../components/ChartComponent';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DelinquencyDashboard() {
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  // Aging Analysis Data
  const agingData = {
    labels: ['Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [250000, 120000, 85000, 45000, 30000],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 99, 132, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Collection Trend Data
  const collectionTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Collection Rate',
        data: [96.5, 97.2, 95.8, 96.9, 97.5, 96.8, 97.1, 96.7, 97.3, 96.9, 97.4, 97.8],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true
      }
    ]
  };

  // Delinquent Tenants Data
  const delinquentTenants = [
    {
      tenant: 'ABC Corporation',
      property: 'Highland Towers',
      outstanding: 45000,
      aging: '31-60 Days',
      lastPayment: '2024-01-15',
      status: 'High Risk'
    },
    {
      tenant: 'XYZ Enterprises',
      property: 'Metropolitan Plaza',
      outstanding: 28000,
      aging: '1-30 Days',
      lastPayment: '2024-02-01',
      status: 'Medium Risk'
    },
    {
      tenant: 'Global Services Inc',
      property: 'Sunset Gardens',
      outstanding: 62000,
      aging: '90+ Days',
      lastPayment: '2023-11-15',
      status: 'Critical'
    },
    {
      tenant: 'Tech Solutions LLC',
      property: '522 River St',
      outstanding: 15000,
      aging: '1-30 Days',
      lastPayment: '2024-02-10',
      status: 'Low Risk'
    }
  ];

  return (
    <div className="px-6 py-8">
      {/* Header with Filters */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Delinquency Dashboard</h1>
        <div className="flex gap-4">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="highland">Highland Towers</SelectItem>
              <SelectItem value="metro">Metropolitan Plaza</SelectItem>
              <SelectItem value="sunset">Sunset Gardens</SelectItem>
              <SelectItem value="river">522 River St</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Month</SelectItem>
              <SelectItem value="last">Last Month</SelectItem>
              <SelectItem value="q1">Q1 2024</SelectItem>
              <SelectItem value="q4">Q4 2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Delinquent Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">$530,000</p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-red-500">+2.8%</span>
              <span className="text-gray-500 ml-2">vs Last Month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">97.8%</p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-green-500">+0.4%</span>
              <span className="text-gray-500 ml-2">vs Last Month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delinquent Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">12</p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-red-500">+2</span>
              <span className="text-gray-500 ml-2">vs Last Month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bad Debt Write-offs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-600">$15,000</p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-green-500">-25%</span>
              <span className="text-gray-500 ml-2">vs Last Month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Aging Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent 
              type="bar"
              data={agingData}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent 
              type="line"
              data={collectionTrendData}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Delinquent Tenants Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Delinquent Tenants</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Filter</Button>
            <Button size="sm">Export</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outstanding</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aging</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {delinquentTenants.map((tenant, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tenant.tenant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tenant.property}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${tenant.outstanding.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tenant.aging}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tenant.lastPayment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tenant.status === 'Low Risk' ? 'bg-green-100 text-green-800' :
                        tenant.status === 'Medium Risk' ? 'bg-yellow-100 text-yellow-800' :
                        tenant.status === 'High Risk' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button variant="outline" size="sm">View Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 