// src/components/ui/logsDisplay.jsx
import { useState, useEffect } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";
function LogsDisplay({
    swapBackendIdlFactory,
    swapBackendCanisterId,
}) {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const agent = new HttpAgent();
        const logsActor = Actor.createActor(swapBackendIdlFactory, {
            agent,
            canisterId: swapBackendCanisterId,
        });

        async function fetchLogs() {
            setError(null);
            try {
                const logs = await logsActor.getLogs();
                setLogs(logs);
            } catch (err) {
                console.error("Error fetching logs:", err);
                setError(err.toString());
            }
        }

        fetchLogs();
    }, [swapBackendIdlFactory, swapBackendCanisterId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="absolute top-0 left-0 m-4 text-lg border-none bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded shadow-lg shadow-indigo-600/50"
                >
                    Add Token Instruction
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-indigo-900 max-w-md">
                <Table>
                    <TableCaption>Transaction Logs</TableCaption>
                    <TableHead>
                        <TableRow>
                            <TableHeader>Time</TableHeader>
                            <TableHeader>Principal</TableHeader>
                            <TableHeader>Amount (e8s)</TableHeader>
                            <TableHeader>Refcode</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log, index) => (
                            <TableRow key={index}>
                                <TableCell>{format(new Date(log.time / 1e6), 'yyyy-MM-dd HH:mm:ss')} UTC</TableCell>
                                <TableCell>{log.principal}</TableCell>
                                <TableCell>{log.icp_amount_e8s}</TableCell>
                                <TableCell>{log.refcode || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
}

export default LogsDisplay;