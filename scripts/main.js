// ================== CONFIGURACIÓN D3 ==================
const svgWidth = 700;
const svgHeight = 400;
const margin = { top: 30, right: 30, bottom: 40, left: 80 };

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

let xScale = d3.scaleLinear().range([0, width]);
let yScale = d3.scaleBand().range([0, height]).padding(0.2);

const colorScale = d3.scaleOrdinal(d3.schemeSet2);

// ================== FUNCIÓN PARA DIBUJAR ==================
function updateChart(data) {
  // Escalas
  xScale.domain([0, d3.max(data)]);
  yScale.domain(data.map((d, i) => `Item ${i + 1}`));

  // Ejes
  svg.selectAll(".x-axis").remove();
  svg.selectAll(".y-axis").remove();

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(10));

  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));

  // Bind data
  const bars = svg.selectAll(".bar")
    .data(data);

  // ENTER + UPDATE
  bars.enter()
    .append("rect")
    .attr("class", "bar")
    .merge(bars)
    .transition()
    .duration(800)
    .attr("x", 0)
    .attr("y", (d, i) => yScale(`Item ${i + 1}`))
    .attr("width", d => xScale(d))
    .attr("height", yScale.bandwidth())
    .attr("fill", (d, i) => colorScale(i));

  const labels = svg.selectAll(".label")
    .data(data);

  labels.enter()
    .append("text")
    .attr("class", "label")
    .merge(labels)
    .transition()
    .duration(800)
    .attr("x", d => xScale(d) + 5)
    .attr("y", (d, i) => yScale(`Item ${i + 1}`) + yScale.bandwidth() / 2 + 5)
    .text(d => d);

  // EXIT
  bars.exit().remove();
  labels.exit().remove();
}

// ================== BOTÓN UPDATE ===================
document.getElementById("updateBtn").addEventListener("click", () => {
  const input = document.getElementById("dataInput").value.trim();

  // Validar formato: solo números separados por coma
  if (!/^\d+(,\d+)*$/.test(input)) {
    alert("Formato inválido. Use solo números enteros separados por coma. Ej: 5,10,15");
    return;
  }

  const data = input.split(",").map(d => +d);
  updateChart(data);
});

// ================== ENTER EN INPUT ==================
document.getElementById("dataInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("updateBtn").click();
  }
});

// ================== BOTÓN CLEAR ==================
document.getElementById("clearBtn").addEventListener("click", () => {
    svg.selectAll("*").remove();  
    document.getElementById("dataInput").value = ""; 
});

