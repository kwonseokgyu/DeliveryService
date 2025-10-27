import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

export default function DeliverySettlement() {
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [compareRecord1, setCompareRecord1] = useState(null);
  const [compareRecord2, setCompareRecord2] = useState(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const saved = localStorage.getItem("delivery-records");
      if (saved) setRecords(JSON.parse(saved));
    } catch (error) {
      console.log("저장된 데이터가 없습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecords = (newRecords) => {
    localStorage.setItem("delivery-records", JSON.stringify(newRecords));
  };

  const getComparison = (currentRecord, previousRecord) => {
    if (!previousRecord) return null;
    const costDiff = currentRecord.cost - previousRecord.cost;
    const costChangePercent = (costDiff / previousRecord.cost) * 100;
    let quantityDiff = null,
      quantityChangePercent = null;
    if (currentRecord.quantity && previousRecord.quantity) {
      quantityDiff = currentRecord.quantity - previousRecord.quantity;
      quantityChangePercent = (quantityDiff / previousRecord.quantity) * 100;
    }
    return {
      previousRecord,
      costDiff,
      costChangePercent,
      quantityDiff,
      quantityChangePercent,
    };
  };

  const handleAdd = () => {
    if (!startDate || !endDate || !cost) {
      alert("시작일, 종료일, 비용은 필수 입력 항목입니다.");
      return;
    }
    if (startDate > endDate) {
      alert("종료일은 시작일보다 이후여야 합니다.");
      return;
    }
    const newRecord = {
      id: Date.now(),
      startDate,
      endDate,
      cost: parseFloat(cost),
      quantity: quantity ? parseInt(quantity) : null,
    };
    const newRecords = [...records, newRecord].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
    setRecords(newRecords);
    saveRecords(newRecords);
    setStartDate("");
    setEndDate("");
    setCost("");
    setQuantity("");
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setStartDate(record.startDate);
    setEndDate(record.endDate);
    setCost(record.cost.toString());
    setQuantity(record.quantity ? record.quantity.toString() : "");
  };

  const handleUpdate = () => {
    if (!startDate || !endDate || !cost) {
      alert("시작일, 종료일, 비용은 필수 입력 항목입니다.");
      return;
    }
    if (startDate > endDate) {
      alert("종료일은 시작일보다 이후여야 합니다.");
      return;
    }
    const newRecords = records
      .map((r) =>
        r.id === editingId
          ? {
              ...r,
              startDate,
              endDate,
              cost: parseFloat(cost),
              quantity: quantity ? parseInt(quantity) : null,
            }
          : r
      )
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    setRecords(newRecords);
    saveRecords(newRecords);
    setEditingId(null);
    setStartDate("");
    setEndDate("");
    setCost("");
    setQuantity("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("이 기록을 삭제하시겠습니까?")) return;
    const newRecords = records.filter((r) => r.id !== id);
    setRecords(newRecords);
    saveRecords(newRecords);
    if (compareRecord1?.id === id) setCompareRecord1(null);
    if (compareRecord2?.id === id) setCompareRecord2(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setStartDate("");
    setEndDate("");
    setCost("");
    setQuantity("");
  };

  const handleSelectForCompare = (record) => {
    if (!compareRecord1) setCompareRecord1(record);
    else if (!compareRecord2 && record.id !== compareRecord1.id)
      setCompareRecord2(record);
    else {
      setCompareRecord1(record);
      setCompareRecord2(null);
    }
  };

  const resetComparison = () => {
    setCompareRecord1(null);
    setCompareRecord2(null);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);

  const formatDateRange = (start, end) =>
    start === end ? start : `${start} ~ ${end}`;

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to br, #ebf8ff, #ede9fe)",
      padding: "16px",
    },
    card: {
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: "24px",
      marginBottom: "32px",
    },
    header: {
      fontSize: "32px",
      fontWeight: 700,
      textAlign: "center",
      marginBottom: "32px",
      color: "#1f2937",
    },
    grid5: {
      display: "grid",
      gridTemplateColumns: "repeat(1,1fr) md:repeat(5,1fr)",
      gap: "16px",
    },
    input: {
      width: "100%",
      padding: "8px 12px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      outline: "none",
    },
    buttonPrimary: {
      background: "#3b82f6",
      color: "#fff",
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
    },
    buttonSecondary: {
      background: "#6b7280",
      color: "#fff",
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      textAlign: "center",
      padding: "12px",
      fontSize: "12px",
      color: "#6b7280",
      borderBottom: "1px solid #e5e7eb",
    },
    td: {
      padding: "12px",
      fontSize: "14px",
      color: "#1f2937",
      borderBottom: "1px solid #e5e7eb",
      textAlign: "center",
      cursor: "pointer",
    },
    compareCard: (color) => ({
      padding: "16px",
      borderRadius: "12px",
      border: `2px solid ${color}`,
      background: `${color}22`,
    }),
    selectedRow: { background: "#fde68a33" },
  };

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        로딩 중...
      </div>
    );

  const ComparisonSection = ({ record1, record2 }) => {
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
              style={{
                color: costArrow.color,
                fontWeight: costArrow.fontWeight,
              }}
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

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={styles.header}>📦 택배 정산 관리</h1>

        {/* 입력 폼 */}
        <div style={styles.card}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "16px",
            }}
          >
            {editingId ? "정산 수정" : "정산 추가"}
          </h2>
          <div style={styles.grid5}>
            <div>
              <label>시작일 *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={styles.input}
              />
            </div>
            <div>
              <label>종료일 *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={styles.input}
              />
            </div>
            <div>
              <label>비용 *</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                style={styles.input}
              />
            </div>
            <div>
              <label>수량</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={styles.input}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}
            >
              {editingId ? (
                <>
                  <button onClick={handleUpdate} style={styles.buttonPrimary}>
                    <Save size={20} /> 저장
                  </button>
                  <button onClick={handleCancel} style={styles.buttonSecondary}>
                    <X size={20} />
                  </button>
                </>
              ) : (
                <button onClick={handleAdd} style={styles.buttonPrimary}>
                  <Plus size={20} /> 추가
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 비교 카드 */}
        {(compareRecord1 || compareRecord2) && (
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            <div style={styles.compareCard("#3b82f6")}>
              <div>비교1</div>
              {compareRecord1 ? (
                <>
                  <div>
                    {formatDateRange(
                      compareRecord1.startDate,
                      compareRecord1.endDate
                    )}
                  </div>
                  <div>비용: {formatCurrency(compareRecord1.cost)}</div>
                  {compareRecord1.quantity && (
                    <div>수량: {compareRecord1.quantity}</div>
                  )}
                </>
              ) : (
                <div>선택 대기중</div>
              )}
            </div>
            <div style={styles.compareCard("#f97316")}>
              <div>비교2</div>
              {compareRecord2 ? (
                <>
                  <div>
                    {formatDateRange(
                      compareRecord2.startDate,
                      compareRecord2.endDate
                    )}
                  </div>
                  <div>비용: {formatCurrency(compareRecord2.cost)}</div>
                  {compareRecord2.quantity && (
                    <div>수량: {compareRecord2.quantity}</div>
                  )}
                </>
              ) : (
                <div>선택 대기중</div>
              )}
            </div>
          </div>
        )}

        {/* 비교 그래프 + 변화 퍼센트 */}
        {compareRecord1 && compareRecord2 && (
          <ComparisonSection
            record1={compareRecord1}
            record2={compareRecord2}
          />
        )}

        {/* 전체 테이블 */}
        {records.length > 0 && (
          <div style={styles.card}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>정산 기간</th>
                  <th style={styles.th}>비용</th>
                  <th style={styles.th}>이전 대비</th>
                  <th style={styles.th}>수량</th>
                  <th style={styles.th}>작업</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => {
                  const prev = i > 0 ? records[i - 1] : null;
                  const comp = getComparison(r, prev);
                  const isSelected =
                    compareRecord1?.id === r.id || compareRecord2?.id === r.id;
                  return (
                    <tr
                      key={r.id}
                      style={isSelected ? styles.selectedRow : {}}
                      onClick={() => handleSelectForCompare(r)}
                    >
                      <td style={styles.td}>
                        {formatDateRange(r.startDate, r.endDate)}
                      </td>
                      <td style={styles.td}>{formatCurrency(r.cost)}</td>
                      <td style={styles.td}>
                        {comp
                          ? `${comp.costDiff > 0 ? "+" : ""}${formatCurrency(
                              comp.costDiff
                            )} (${comp.costChangePercent.toFixed(1)}%)`
                          : "-"}
                      </td>
                      <td style={styles.td}>{r.quantity || "-"}</td>
                      <td style={styles.td}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleEdit(r)}
                            style={{
                              ...styles.buttonPrimary,
                              padding: "4px 8px",
                              fontSize: "12px",
                            }}
                          >
                            <Edit2 size={16} /> 수정
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            style={{
                              ...styles.buttonSecondary,
                              padding: "4px 8px",
                              fontSize: "12px",
                            }}
                          >
                            <Trash2 size={16} /> 삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
