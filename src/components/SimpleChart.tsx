

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  title: string;
  data: ChartData[];
}

const SimpleChart: React.FC<SimpleChartProps> = ({ title, data }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="simple-chart">
      <h4 className="chart-title">{title}</h4>
      <div className="chart-container">
        {data.map((item, index) => (
          <div key={index} className="chart-bar-container">
            <div className="chart-label">{item.label}</div>
            <div className="chart-bar-wrapper">
              <div 
                className="chart-bar"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || 'var(--color-primary)'
                }}
              />
              <span className="chart-value">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleChart;