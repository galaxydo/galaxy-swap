// src/pages/admin.jsx
import React, { useContext } from "react";
import LogsDisplay from "../components/ui/logsDisplay";

function AdminPage({
    swapBackendIdlFactory,
    swapBackendCanisterId,
}) {
    return (
        <div className="admin-page-container">
            <h1>Admin Dashboard</h1>
            <LogsDisplay
                swapBackendIdlFactory={swapBackendIdlFactory}
                swapBackendCanisterId={swapBackendCanisterId}
            />
        </div>
    );
}

export default AdminPage;