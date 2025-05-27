import React from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer} from 'recharts'
import './Stats.css'

const globalData = [
  { year: 2000, waste: 100 },
  { year: 2001, waste: 110 },
  { year: 2002, waste: 120 },
  { year: 2003, waste: 130 },
  { year: 2004, waste: 140 },
  { year: 2005, waste: 150 },
];

const indiaData = [
  { year: 2000, waste: 40 },
  { year: 2001, waste: 45 },
  { year: 2002, waste: 50 },
  { year: 2003, waste: 55 },
  { year: 2004, waste: 60 },
  { year: 2005, waste: 65 },
];

const countryData = [
  { country: 'USA', waste: 100 },
  { country: 'India', waste: 50 },
  { country: 'Brazil', waste: 30 },
  { country: 'China', waste: 70 },
  { country: 'Germany', waste: 40 },
];

const sourceData = [
  { name: 'Households', value: 50 },
  { name: 'Farms', value: 20 },
  { name: 'Retailers', value: 15 },
  { name: 'Food Services', value: 10 },
  { name: 'Manufacturers', value: 5 },
];

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const Stats = () => {
  return (
    <div className="stats-box">
      <h2>Food Waste Statistics</h2>
      <div className="charts-scroll-wrapper">
        <div className="chart-item">
          <h3>Global Food Waste</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={globalData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line dataKey="waste" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <h3>India's Food Waste</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={indiaData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line dataKey="waste" stroke="#387908" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <h3>Top Countries Per Capita</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={countryData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="waste" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <h3>Sources of Food Waste</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {sourceData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats;
