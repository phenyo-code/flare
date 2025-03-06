"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function CustomChart({ data, topCustomers, topProducts, oldProducts, recentOrders, salesByCategory, keyMetrics, newsletterSubscribers }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [chartType, setChartType] = useState("column");
  const [tooltip, setTooltip] = useState<{ name: string; value: number; percent: number; x: number; y: number } | null>(null);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [visibleStats, setVisibleStats] = useState<string[]>(data.map((d: { name: string }) => d.name));

  const width = 600;
  const height = 300;
  const padding = 40;

  const maxValues: { [key: string]: number } = {
    Products: 500,
    Customers: 2000,
    Orders: 1000,
    "Sales (R)": 50000,
  };

  const handleMouseOver = (item: { name: string; value: number }, x: number, y: number) => {
    setTooltip({
      name: item.name,
      value: item.value,
      percent: Math.round((item.value / maxValues[item.name]) * 100),
      x,
      y,
    });
  };

  const handleMouseOut = () => {
    setTooltip(null);
  };

  const toggleStat = (statName: string) => {
    setVisibleStats((prev) => {
      const newStats = prev.includes(statName) ? prev.filter((s) => s !== statName) : [...prev, statName];
      console.log("Visible stats updated:", newStats);
      return newStats;
    });
  };

  const handleViewChange = (view: string) => {
    setSelectedView((prev) => (prev === view ? null : view));
    console.log("Selected view:", view);
    console.log("topCustomers:", topCustomers);
    console.log("topProducts:", topProducts);
    console.log("oldProducts:", oldProducts);
    console.log("recentOrders:", recentOrders);
    console.log("salesByCategory:", salesByCategory);
    console.log("keyMetrics:", keyMetrics);
    console.log("newsletterSubscribers:", newsletterSubscribers);
  };

  const filteredData = data.filter((item: { name: string }) => visibleStats.includes(item.name));

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.innerHTML = ""; // Clear previous content
    console.log("Rendering chart with filteredData:", filteredData);

    const renderChart = (chartData: { name: string; value: number }[]) => {
      if (chartType === "bar") {
        const barHeight = (height - padding * 2) / chartData.length * 0.8;
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
          const x = padding + (i * (width - padding * 2)) / gridLines;
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", x.toString());
          line.setAttribute("y1", padding.toString());
          line.setAttribute("x2", x.toString());
          line.setAttribute("y2", (height - padding).toString());
          line.setAttribute("stroke", "#e5e7eb");
          line.setAttribute("stroke-dasharray", "3 3");
          svg.appendChild(line);

          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", x.toString());
          label.setAttribute("y", (height - padding + 20).toString());
          label.setAttribute("text-anchor", "middle");
          label.setAttribute("fill", "#6b7280");
          label.textContent = `${i * 20}%`;
          svg.appendChild(label);
        }

        chartData.forEach((item, index) => {
          const y = padding + index * (height - padding * 2) / chartData.length;
          const percent = (item.value / maxValues[item.name]) * 100;
          const barWidth = (percent / 100) * (width - padding * 2);

          const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          bar.setAttribute("x", padding.toString());
          bar.setAttribute("y", (y + barHeight * 0.1).toString());
          bar.setAttribute("width", barWidth.toString());
          bar.setAttribute("height", barHeight.toString());
          bar.setAttribute("fill", "#ef4444");
          bar.setAttribute("ry", "4");
          bar.addEventListener("mouseover", () => handleMouseOver(item, padding + barWidth / 2, y + barHeight / 2));
          bar.addEventListener("mouseout", handleMouseOut);
          svg.appendChild(bar);

          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", (padding - 10).toString());
          label.setAttribute("y", (y + barHeight / 2 + barHeight * 0.1).toString());
          label.setAttribute("text-anchor", "end");
          label.setAttribute("fill", "#6b7280");
          label.textContent = `${item.name} (${Math.round(percent)}%)`;
          svg.appendChild(label);
        });
      } else if (chartType === "column") {
        const barWidth = (width - padding * 2) / chartData.length * 0.8;
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
          const y = height - padding - (i * (height - padding * 2)) / gridLines;
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", padding.toString());
          line.setAttribute("y1", y.toString());
          line.setAttribute("x2", (width - padding).toString());
          line.setAttribute("y2", y.toString());
          line.setAttribute("stroke", "#e5e7eb");
          line.setAttribute("stroke-dasharray", "3 3");
          svg.appendChild(line);

          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", (padding - 10).toString());
          label.setAttribute("y", (y + 4).toString());
          label.setAttribute("text-anchor", "end");
          label.setAttribute("fill", "#6b7280");
          label.textContent = `${i * 20}%`;
          svg.appendChild(label);
        }

        chartData.forEach((item, index) => {
          const x = padding + index * (width - padding * 2) / chartData.length;
          const percent = (item.value / maxValues[item.name]) * 100;
          const barHeight = (percent / 100) * (height - padding * 2);
          const y = height - padding - barHeight;

          const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          bar.setAttribute("x", (x + barWidth * 0.1).toString());
          bar.setAttribute("y", y.toString());
          bar.setAttribute("width", barWidth.toString());
          bar.setAttribute("height", barHeight.toString());
          bar.setAttribute("fill", "#ef4444");
          bar.setAttribute("rx", "4");
          bar.addEventListener("mouseover", () => handleMouseOver(item, x + barWidth / 2, y + barHeight / 2));
          bar.addEventListener("mouseout", handleMouseOut);
          svg.appendChild(bar);

          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", (x + barWidth / 2 + barWidth * 0.1).toString());
          label.setAttribute("y", (height - padding + 20).toString());
          label.setAttribute("text-anchor", "middle");
          label.setAttribute("fill", "#6b7280");
          label.textContent = `${item.name} (${Math.round(percent)}%)`;
          svg.appendChild(label);
        });
      } else if (chartType === "line") {
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
          const y = height - padding - (i * (height - padding * 2)) / gridLines;
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", padding.toString());
          line.setAttribute("y1", y.toString());
          line.setAttribute("x2", (width - padding).toString());
          line.setAttribute("y2", y.toString());
          line.setAttribute("stroke", "#e5e7eb");
          line.setAttribute("stroke-dasharray", "3 3");
          svg.appendChild(line);

          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", (padding - 10).toString());
          label.setAttribute("y", (y + 4).toString());
          label.setAttribute("text-anchor", "end");
          label.setAttribute("fill", "#6b7280");
          label.textContent = `${i * 20}%`;
          svg.appendChild(label);
        }

        const points = chartData.map((item, index) => {
          const x = padding + (index * (width - padding * 2)) / (chartData.length - 1);
          const percent = (item.value / maxValues[item.name]) * 100;
          const y = height - padding - (percent / 100) * (height - padding * 2);
          return `${x},${y}`;
        });

        const path = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        path.setAttribute("points", points.join(" "));
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#ef4444");
        path.setAttribute("stroke-width", "2");
        svg.appendChild(path);

        chartData.forEach((item, index) => {
          const x = padding + (index * (width - padding * 2)) / (chartData.length - 1);
          const percent = (item.value / maxValues[item.name]) * 100;
          const y = height - padding - (percent / 100) * (height - padding * 2);

          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", x.toString());
          circle.setAttribute("cy", y.toString());
          circle.setAttribute("r", "4");
          circle.setAttribute("fill", "#ef4444");
          circle.addEventListener("mouseover", () => handleMouseOver(item, x, y));
          circle.addEventListener("mouseout", handleMouseOut);
          svg.appendChild(circle);

          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", x.toString());
          label.setAttribute("y", (height - padding + 20).toString());
          label.setAttribute("text-anchor", "middle");
          label.setAttribute("fill", "#6b7280");
          label.textContent = `${item.name} (${Math.round(percent)}%)`;
          svg.appendChild(label);
        });
      } else if (chartType === "area") {
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
          const y = height - padding - (i * (height - padding * 2)) / gridLines;
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", padding.toString());
          line.setAttribute("y1", y.toString());
          line.setAttribute("x2", (width - padding).toString());
          line.setAttribute("y2", y.toString());
          line.setAttribute("stroke", "#e5e7eb");
          line.setAttribute("stroke-dasharray", "3 3");
          svg.appendChild(line);

          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", (padding - 10).toString());
          label.setAttribute("y", (y + 4).toString());
          label.setAttribute("text-anchor", "end");
          label.setAttribute("fill", "#6b7280");
          label.textContent = `${i * 20}%`;
          svg.appendChild(label);
        }

        const points = chartData.map((item, index) => {
          const x = padding + (index * (width - padding * 2)) / (chartData.length - 1);
          const percent = (item.value / maxValues[item.name]) * 100;
          const y = height - padding - (percent / 100) * (height - padding * 2);
          return `${x},${y}`;
        });
        const areaPoints = `${padding},${height - padding} ${points.join(" ")} ${width - padding},${height - padding}`;

        const area = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        area.setAttribute("points", areaPoints);
        area.setAttribute("fill", "rgba(239, 68, 68, 0.3)");
        area.setAttribute("stroke", "#ef4444");
        area.setAttribute("stroke-width", "2");
        svg.appendChild(area);

        chartData.forEach((item, index) => {
          const x = padding + (index * (width - padding * 2)) / (chartData.length - 1);
          const percent = (item.value / maxValues[item.name]) * 100;
          const y = height - padding - (percent / 100) * (height - padding * 2);

          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", x.toString());
          circle.setAttribute("cy", y.toString());
          circle.setAttribute("r", "4");
          circle.setAttribute("fill", "#ef4444");
          circle.addEventListener("mouseover", () => handleMouseOver(item, x, y));
          circle.addEventListener("mouseout", handleMouseOut);
          svg.appendChild(circle);

          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", x.toString());
          label.setAttribute("y", (height - padding + 20).toString());
          label.setAttribute("text-anchor", "middle");
          label.setAttribute("fill", "#6b7280");
          label.textContent = `${item.name} (${Math.round(percent)}%)`;
          svg.appendChild(label);
        });
      } else if (chartType === "scatter") {
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
          const y = height - padding - (i * (height - padding * 2)) / gridLines;
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", padding.toString());
          line.setAttribute("y1", y.toString());
          line.setAttribute("x2", (width - padding).toString());
          line.setAttribute("y2", y.toString());
          line.setAttribute("stroke", "#e5e7eb");
          line.setAttribute("stroke-dasharray", "3 3");
          svg.appendChild(line);

          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", (padding - 10).toString());
          label.setAttribute("y", (y + 4).toString());
          label.setAttribute("text-anchor", "end");
          label.setAttribute("fill", "#6b7280");
          label.textContent = `${i * 20}%`;
          svg.appendChild(label);
        }

        chartData.forEach((item, index) => {
          const x = padding + (index * (width - padding * 2)) / (chartData.length - 1);
          const percent = (item.value / maxValues[item.name]) * 100;
          const y = height - padding - (percent / 100) * (height - padding * 2);

          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", x.toString());
          circle.setAttribute("cy", y.toString());
          circle.setAttribute("r", "6");
          circle.setAttribute("fill", "#ef4444");
          circle.addEventListener("mouseover", () => handleMouseOver(item, x, y));
          circle.addEventListener("mouseout", handleMouseOut);
          svg.appendChild(circle);

          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", x.toString());
          label.setAttribute("y", (height - padding + 20).toString());
          label.setAttribute("text-anchor", "middle");
          label.setAttribute("fill", "#6b7280");
          label.textContent = `${item.name} (${Math.round(percent)}%)`;
          svg.appendChild(label);
        });
      } else if (chartType === "radar") {
        const radius = Math.min(width, height) / 2 - padding;
        const centerX = width / 2;
        const centerY = height / 2;
        const angleStep = (2 * Math.PI) / chartData.length;

        for (let i = 1; i <= 5; i++) {
          const r = (i / 5) * radius;
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", centerX.toString());
          circle.setAttribute("cy", centerY.toString());
          circle.setAttribute("r", r.toString());
          circle.setAttribute("fill", "none");
          circle.setAttribute("stroke", "#e5e7eb");
          circle.setAttribute("stroke-dasharray", "3 3");
          svg.appendChild(circle);

          if (i === 5) {
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", (centerX - 10).toString());
            label.setAttribute("y", (centerY - r - 5).toString());
            label.setAttribute("text-anchor", "end");
            label.setAttribute("fill", "#6b7280");
            label.textContent = "100%";
            svg.appendChild(label);
          }
        }

        for (let i = 0; i < chartData.length; i++) {
          const angle = i * angleStep;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", centerX.toString());
          line.setAttribute("y1", centerY.toString());
          line.setAttribute("x2", x.toString());
          line.setAttribute("y2", y.toString());
          line.setAttribute("stroke", "#e5e7eb");
          line.setAttribute("stroke-dasharray", "3 3");
          svg.appendChild(line);
        }

        const points = chartData.map((item, index) => {
          const percent = (item.value / maxValues[item.name]) * 100;
          const r = (percent / 100) * radius;
          const angle = index * angleStep;
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);
          return `${x},${y}`;
        }).join(" ");

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", points);
        polygon.setAttribute("fill", "rgba(239, 68, 68, 0.3)");
        polygon.setAttribute("stroke", "#ef4444");
        polygon.setAttribute("stroke-width", "2");
        svg.appendChild(polygon);

        chartData.forEach((item, index) => {
          const angle = index * angleStep;
          const percent = (item.value / maxValues[item.name]) * 100;
          const r = (percent / 100) * radius;
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);

          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", x.toString());
          circle.setAttribute("cy", y.toString());
          circle.setAttribute("r", "4");
          circle.setAttribute("fill", "#ef4444");
          circle.addEventListener("mouseover", () => handleMouseOver(item, x, y));
          circle.addEventListener("mouseout", handleMouseOut);
          svg.appendChild(circle);

          const labelX = centerX + (radius + 20) * Math.cos(angle);
          const labelY = centerY + (radius + 20) * Math.sin(angle);
          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", labelX.toString());
          label.setAttribute("y", labelY.toString());
          label.setAttribute("text-anchor", angle > Math.PI / 2 && angle < 3 * Math.PI / 2 ? "end" : "start");
          label.setAttribute("fill", "#6b7280");
          label.textContent = `${item.name} (${Math.round(percent)}%)`;
          svg.appendChild(label);
        });
      }
    };

    renderChart(filteredData);
  }, [filteredData, chartType]);

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div>
          <label htmlFor="chartType" className="mr-2 text-gray-800 font-medium">Chart Type:</label>
          <select
            id="chartType"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-red-500"
          >
            <option value="bar">Bar (Horizontal)</option>
            <option value="column">Column (Vertical)</option>
            <option value="line">Line</option>
            <option value="area">Area</option>
            <option value="scatter">Scatter</option>
            <option value="radar">Radar</option>
          </select>
        </div>
        <div className="flex gap-4">
          {data.map((item: { name: string }) => (
            <label key={item.name} className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={visibleStats.includes(item.name)}
                onChange={() => toggleStat(item.name)}
                className="mr-2 h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
              />
              {item.name}
            </label>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleViewChange("Popular Products")}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Popular Products
          </button>
          <button
            onClick={() => handleViewChange("Old Products")}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Old Products
          </button>
          <button
            onClick={() => handleViewChange("Recent Orders")}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Recent Orders
          </button>
          <button
            onClick={() => handleViewChange("Top Customers")}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Top Customers
          </button>
          <button
            onClick={() => handleViewChange("Sales by Category")}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Sales by Category
          </button>
          <button
            onClick={() => handleViewChange("Key Metrics")}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Key Metrics
          </button>
          <button
            onClick={() => handleViewChange("Newsletter Subscribers")}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Newsletter Subscribers
          </button>
        </div>
      </div>
      <div className="relative h-80">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        />
        {tooltip && (
          <div
            className="absolute bg-gray-800 text-white p-2 rounded-md shadow-md text-sm"
            style={{
              left: `${tooltip.x + 10}px`,
              top: `${tooltip.y - 40}px`,
              transform: "translate(-50%, 0)",
            }}
          >
            <p>{tooltip.name}</p>
            <p>Value: {tooltip.value}</p>
            <p>Percent: {tooltip.percent}%</p>
          </div>
        )}
      </div>
      <div className="mt-4">
        {selectedView ? (
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">{selectedView}</h4>
            {(selectedView === "Popular Products" && topProducts && topProducts.length > 0) ||
            (selectedView === "Old Products" && oldProducts && oldProducts.length > 0) ? (
              <table className="w-full text-gray-700">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-4">Image</th>
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Category</th>
                    <th className="text-left py-2 px-4">Total Sold</th>
                    {selectedView === "Old Products" && <th className="text-left py-2 px-4">Created Date</th>}
                    <th className="text-left py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedView === "Popular Products" ? topProducts : oldProducts).map((product: any) => (
                    <tr key={product.productId} className="border-b border-gray-200">
                      <td className="py-2 px-4">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </td>
                      <td className="py-2 px-4">{product.name}</td>
                      <td className="py-2 px-4">{product.category}</td>
                      <td className="py-2 px-4">{product.totalSold}</td>
                      {selectedView === "Old Products" && (
                        <td className="py-2 px-4">{new Date(product.createdAt).toLocaleDateString()}</td>
                      )}
                      <td className="py-2 px-4">
                        <Link href={`/update-product/${product.productId}`}>
                          <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            Edit
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : selectedView === "Recent Orders" && recentOrders && recentOrders.length > 0 ? (
              <table className="w-full text-gray-700">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-4">Order ID</th>
                    <th className="text-left py-2 px-4">Total Price</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-gray-200">
                      <td className="py-2 px-4">{order.id}</td>
                      <td className="py-2 px-4">R{order.totalPrice.toFixed(2)}</td>
                      <td className="py-2 px-4">{order.status}</td>
                      <td className="py-2 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : selectedView === "Top Customers" && topCustomers && topCustomers.length > 0 ? (
              <table className="w-full text-gray-700">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Email</th>
                    <th className="text-left py-2 px-4">Total Spent</th>
                    <th className="text-left py-2 px-4">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((customer: any) => (
                    <tr key={customer.userId} className="border-b border-gray-200">
                      <td className="py-2 px-4">{customer.name}</td>
                      <td className="py-2 px-4">{customer.email}</td>
                      <td className="py-2 px-4">R{customer.totalSpent.toFixed(2)}</td>
                      <td className="py-2 px-4">{customer.orderCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : selectedView === "Newsletter Subscribers" && newsletterSubscribers && newsletterSubscribers.length > 0 ? (
              <table className="w-full text-gray-700">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Email</th>
                    <th className="text-left py-2 px-4">Total Spent</th>
                    <th className="text-left py-2 px-4">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletterSubscribers.map((subscriber: any) => (
                    <tr key={subscriber.userId} className="border-b border-gray-200">
                      <td className="py-2 px-4">{subscriber.name}</td>
                      <td className="py-2 px-4">{subscriber.email}</td>
                      <td className="py-2 px-4">R{subscriber.totalSpent.toFixed(2)}</td>
                      <td className="py-2 px-4">{subscriber.orderCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : selectedView === "Sales by Category" && salesByCategory && salesByCategory.length > 0 ? (
              <table className="w-full text-gray-700">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-4">Category</th>
                    <th className="text-left py-2 px-4">Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {salesByCategory.map((category: any) => (
                    <tr key={category.category} className="border-b border-gray-200">
                      <td className="py-2 px-4">{category.category}</td>
                      <td className="py-2 px-4">R{category.totalSales.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : selectedView === "Key Metrics" && keyMetrics ? (
              <div className="text-gray-700">
                <p><strong>Average Order Value:</strong> R{keyMetrics.averageOrderValue.toFixed(2)}</p>
                <p><strong>Total Orders:</strong> {keyMetrics.totalOrders}</p>
                <p><strong>Total Items Sold:</strong> {keyMetrics.totalItemsSold}</p>
              </div>
            ) : (
              <p className="text-gray-600">No data available for this view.</p>
            )}
          </div>
        ) : (
          <p className="text-gray-600">Click a button to view details.</p>
        )}
      </div>
    </div>
  );
}