import React from "react";
import useAdminData from "../components/useAdminData";
import downloadCSV from "../components/downloadCSV";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  TableHead,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import Spinner from "../components/ui/spinner";
import { Card } from "../components/ui/card";

function AdminPage({ swapBackendIdlFactory, swapBackendCanisterId }) {
  const { data, error, loadingState } = useAdminData(swapBackendIdlFactory);

  const {
    logs,
    exchangeRate,
    icpBalance,
    tokenBalance,
    tokenSold,
    icpReceived,
  } = data;

  const convertE8sToICP = (e8s) => (parseInt(e8s, 10) / 1e8).toFixed(2);

  const renderLoadingSpinner = (isLoading) => isLoading && <Spinner />;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      {error && (
        <div className="mb-6 p-4 bg-red-600 text-white rounded-md shadow-lg">
          <strong>Error:</strong> {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-700 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <span className="font-semibold">Exchange Rate:</span>&nbsp;
          {!exchangeRate
            ? renderLoadingSpinner(loadingState.exchangeRate)
            : exchangeRate} BRD23 = 1 ICP
        </Card>
        <Card className="bg-gray-700 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <span className="font-semibold">ICP Balance:</span>&nbsp;
          {!icpBalance
            ? renderLoadingSpinner(loadingState.icpBalance)
            : (icpBalance / 10e8)}
        </Card>
        <Card className="bg-gray-700 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <span className="font-semibold">Token Balance:</span>&nbsp;
          {!tokenBalance
            ? renderLoadingSpinner(loadingState.tokenBalance)
            : parseFloat((tokenBalance / 1e8).toFixed(2)).toLocaleString()}
        </Card>
        <Card className="bg-gray-700 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <span className="font-semibold">WBRD23 Sold:</span>&nbsp;
          {!tokenSold
            ? renderLoadingSpinner(loadingState.tokenSold)
            : parseFloat((tokenSold / 1e8).toFixed(2)).toLocaleString()}
        </Card>
        <Card className="bg-gray-700 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <span className="font-semibold">ICP Received:</span>&nbsp;
          {!icpReceived
            ? renderLoadingSpinner(loadingState.icpReceived)
            : (icpReceived / 1e8).toFixed(2)}
        </Card>
      </div>

      <h2 className="text-xl font-bold">Purchase Log</h2>
      <Table className="mt-6 shadow-lg rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow className="text-gray-400 bg-gray-700">
            <TableHead>Time</TableHead>
            <TableHead>Principal</TableHead>
            <TableHead>Amount (ICP)</TableHead>
            <TableHead>Refcode</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => {
            const timeInSeconds = Number((log.time / BigInt(1e6)).toString());
            const dateFormatted = format(
              new Date(timeInSeconds),
              "yyyy-MM-dd HH:mm:ss"
            );
            return (
              <TableRow
                key={index}
                className={index % 2 ? "bg-gray-700" : "bg-gray-600"}
              >
                <TableCell>{dateFormatted} UTC</TableCell>
                <TableCell>{log.principal.toText()}</TableCell>
                <TableCell>{convertE8sToICP(log.icp_amount_e8s)}</TableCell>
                <TableCell>{log.refcode || "N/A"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="py-8 flex justify-center">
        <Button
          onClick={() => downloadCSV(logs)}
          className="w-[22rem] text-lg bg-button bg-button-hover py-2 rounded shadow-lg"
        >
          Download Logs as CSV
        </Button>
      </div>
    </div>
  );
}

export default AdminPage;
