// src/pages/admin.jsx
import React, { useState, useEffect } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

function AdminPage({
    swapBackendIdlFactory,
    swapBackendCanisterId,
}) {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Mainnet URL for the Internet Computer
        const IC_MAINNET_URL = "https://icp0.io/";
        const agent = new HttpAgent({
            host: IC_MAINNET_URL,
        });
        const MAINNET_CANISTER_ID = "oyzj3-naaaa-aaaag-qjuka-cai";
        const logsActor = Actor.createActor(swapBackendIdlFactory, {
            agent,
            canisterId: MAINNET_CANISTER_ID
        });

        async function fetchLogs() {
            setError(null);
            try {
                const fetchedLogs = await logsActor.getLogs();
                setLogs(fetchedLogs);
                console.log("Fetched logs:", fetchedLogs);
            } catch (err) {
                console.error("Error fetching logs:", err);
                setError(err.toString());
            }
        }

        fetchLogs();
    }, [swapBackendIdlFactory]);

    // function to handle download csv
    const downloadCSV = () => {
        const csvData = convertToCSV(logs);
        const blog = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blog);
        link.setAttribute('href', url);
        link.setAttribute('download', 'logs.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const convertToCSV = (logs) => {
        const headers = ["Time", "Principal", "Amount (e8s)", "Refcode"];
        const rows = logs.map(log => {
            const timeInSeconds = Number((log.time / BigInt(1e6)).toString());
            const dateFormatted = format(new Date(timeInSeconds), 'yyyy-MM-dd HH:mm:ss');
            return [
                `"${dateFormatted} UTC"`,
                `${log.principal.toText()}`,
                `${log.icp_amount_e8s.toString()}`,
                `${log.refcode || 'N/A'}`
            ];
        });
        return [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    };

    const convertE8sToICP = (e8s) => {
        return (parseInt(e8s, 10) / 100000000).toFixed(2);
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-800 text-white">
            <div className="py-8">
                <h1 className="text-lg leading-6 font-medium">Admin Dashboard</h1>
                {error && <div className="mt-4 bg-red-700 text-white p-2 rounded-md">{error}</div>}
                <Table className="mt-6">
                    <TableHeader>
                        <TableRow className="text-gray-400">
                            <TableHead>Time</TableHead>
                            <TableHead>Principal</TableHead>
                            <TableHead>Amount (ICP)</TableHead>
                            <TableHead>Refcode</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log, index) => {
                            const timeInSeconds = Number((log.time / BigInt(1e6)).toString());
                            const dateFormatted = format(new Date(timeInSeconds), 'yyyy-MM-dd HH:mm:ss');
                            return (
                                <TableRow key={index} className={index % 2 ? "bg-gray-700" : "bg-gray-600"}>
                                    <TableCell>{dateFormatted} UTC</TableCell>
                                    <TableCell>{log.principal.toText()}</TableCell>
                                    <TableCell>{convertE8sToICP(log.icp_amount_e8s)}</TableCell>
                                    <TableCell>{log.refcode || 'N/A'}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <div className="py-8">
                    <Button onClick={downloadCSV} className="my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Download Logs as CSV
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;