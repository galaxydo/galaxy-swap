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

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
                <div className="border-b border-blue-200 pb-5">
                    <h1 className="text-lg leading-6 font-medium text-blue-900">Admin Dashboard</h1>
                </div>
                {error && <div className="mt-4 bg-red-100 text-red-800 p-2 rounded-md">{error}</div>}
                <div className="mt-6 flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-blue-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-blue-200">
                                    <thead className="bg-blue-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                Time
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                Principal
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                Amount (e8s)
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                Refcode
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-blue-200">
                                        {logs.map((log, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                                                    {format(new Date(log.time / 1e6), 'yyyy-MM-dd HH:mm:ss')} UTC
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                                                    {log.principal}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                                                    {log.icp_amount_e8s}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                                                    {log.refcode || 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;