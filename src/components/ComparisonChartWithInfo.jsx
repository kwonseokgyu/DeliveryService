const ComparisonChartWithInfo = ({ record1, record2 }) => {
  if (!record1 || !record2) return null;

  const data = [
    {
      name: "비용",
      [record1.startDate]: record1.cost,
      [record2.startDate]: record2.cost,
    },
    {
      name: "수량",
      [record1.startDate]: record1.quantity || 0,
      [record2.startDate]: record2.quantity || 0,
    },
  ];

  const comp = getComparison(record2, record1);
  const getArrow = (diff) =>
    diff > 0
      ? { symbol: "⬆️", color: "green", fontWeight: 700 }
      : diff < 0
      ? { symbol: "⬇️", color: "red", fontWeight: 700 }
      : { symbol: "➡️", color: "gray", fontWeight: 400 };

  const costArrow = getArrow(comp.costDiff);
  const quantityArrow =
    record1.quantity && record2.quantity ? getArrow(comp.quantityDiff) : null;

  return (
    <div style={{ marginTop: "16px" }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey={record1.startDate}
            fill="#3b82f6"
            name={`${record1.startDate} ~ ${record1.endDate}`}
          />
          <Bar
            dataKey={record2.startDate}
            fill="#f97316"
            name={`${record2.startDate} ~ ${record2.endDate}`}
          />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: "flex", gap: "32px", marginTop: "16px" }}>
        <div>
          비용 변화:{" "}
          <span
            style={{ color: costArrow.color, fontWeight: costArrow.fontWeight }}
          >
            {comp.costChangePercent.toFixed(1)}% {costArrow.symbol}
          </span>
        </div>
        {quantityArrow && (
          <div>
            수량 변화:{" "}
            <span
              style={{
                color: quantityArrow.color,
                fontWeight: quantityArrow.fontWeight,
              }}
            >
              {comp.quantityChangePercent.toFixed(1)}% {quantityArrow.symbol}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
