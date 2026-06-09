export default function GithubHeatmap({ data = [] }) {
  function getColor(count) {
    if (count === 0) return "#ebedf0";

    if (count <= 2) return "#9be9a8";

    if (count <= 5) return "#40c463";

    if (count <= 8) return "#30a14e";

    return "#216e39";
  }

  return (
    <div>
      <h3>Contributions</h3>

      <div
        style={{
          overflowX: "auto",
          paddingBottom: "6px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: "repeat(7, 12px)",
            gridAutoColumns: "12px",
            gap: "3px",
            width: "max-content",
          }}
        >
          {data.map((day, index) => (
            <div
              key={day.date || index}
              title={`${day.date}: ${day.count} contributions`}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "3px",
                background: getColor(day.count),
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "10px",
          color: "#6b7280",
          fontSize: "12px",
        }}
      >
        <span>Less</span>
        {[0, 1, 3, 6, 9].map((count) => (
          <span
            key={count}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "3px",
              background: getColor(count),
              display: "inline-block",
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
