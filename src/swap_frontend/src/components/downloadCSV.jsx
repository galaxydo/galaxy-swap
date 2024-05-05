import { format } from "date-fns";

function downloadCSV(logs) {
  const csvData = convertToCSV(logs);
  const blog = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blog);
  link.setAttribute("href", url);
  link.setAttribute("download", "logs.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const convertToCSV = (logs) => {
  const headers = ["Time", "Principal", "Amount (e8s)", "Refcode"];
  const rows = logs.map((log) => {
    const timeInSeconds = Number((log.time / BigInt(1e6)).toString());
    const dateFormatted = format(
      new Date(timeInSeconds),
      "yyyy-MM-dd HH:mm:ss"
    );
    return [
      `"${dateFormatted} UTC"`,
      `${log.principal.toText()}`,
      `${log.icp_amount_e8s.toString()}`,
      `${log.refcode || "N/A"}`,
    ];
  });
  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
};

export default downloadCSV;
