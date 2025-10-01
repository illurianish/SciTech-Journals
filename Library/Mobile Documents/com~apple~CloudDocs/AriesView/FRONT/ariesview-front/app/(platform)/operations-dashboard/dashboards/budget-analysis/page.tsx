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

export default function BudgetAnalysisDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('ytd');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Budget vs Actual Overview Data
  const budgetOverviewData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Actual',
        data: [820, 850, 890, 905, 930, 958, 980, 1020, 1050, 1080, 1110, 1150],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true
      },
      {
        label: 'Budget',
        data: [800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075],
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false
      }
    ]
  };

  // Expense Categories Data
  const expenseCategoriesData = {
    labels: ['Utilities', 'Maintenance', 'Personnel', 'Insurance', 'Marketing', 'Admin'],
    datasets: [
      {
        label: 'Budget',
        data: [250, 180, 320, 150, 90, 110],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Actual',
        data: [265, 175, 310, 155, 85, 115],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  };

  // Variance Analysis Data
  const varianceData = [
    { category: 'Revenue', budget: 1200000, actual: 1250000, variance: 50000, percentVariance: 4.17 },
    { category: 'Operating Expenses', budget: 450000, actual: 460000, variance: -10000, percentVariance: -2.22 },
    { category: 'Utilities', budget: 120000, actual: 125000, variance: -5000, percentVariance: -4.17 },
    { category: 'Maintenance', budget: 180000, actual: 175000, variance: 5000, percentVariance: 2.78 },
    { category: 'Personnel', budget: 320000, actual: 310000, variance: 10000, percentVariance: 3.13 },
  ];

  return (
    <div className="px-6 py-8">
      {/* Header with Filters */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Budget Analysis Dashboard</h1>
        <div className="flex gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="q1">Q1 2024</SelectItem>
              <SelectItem value="q2">Q2 2024</SelectItem>
              <SelectItem value="q3">Q3 2024</SelectItem>
              <SelectItem value="q4">Q4 2024</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="expenses">Expenses</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">+$50,000</p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-green-500">+4.17%</span>
              <span className="text-gray-500 ml-2">vs Budget</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operating Expense Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">-$10,000</p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-red-500">-2.22%</span>
              <span className="text-gray-500 ml-2">vs Budget</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Operating Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">$790,000</p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-green-500">+8.2%</span>
              <span className="text-gray-500 ml-2">vs Budget</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent 
              type="line"
              data={budgetOverviewData}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Categories Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent 
              type="bar"
              data={expenseCategoriesData}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Variance Analysis Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detailed Variance Analysis</CardTitle>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Variance</th>
                </tr>
              </thead>
              <tbody>
                {varianceData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.actual.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(item.variance).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${item.percentVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.percentVariance >= 0 ? '+' : ''}{item.percentVariance.toFixed(2)}%
                      </span>
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