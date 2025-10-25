'use client';

import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { Shield, Home, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-600">
              You don't have permission to access this page. Please contact an administrator if you believe this is an error.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home size={20} />
              Go Home
            </button>
            
            <button
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
