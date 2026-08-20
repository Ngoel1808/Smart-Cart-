import React from 'react';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-slate-600 mb-6">You don't have permission to access this page.</p>
        <Link to="/" className="btn btn-primary">Go Back</Link>
      </div>
    </div>
  );
}
