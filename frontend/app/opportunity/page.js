'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OpportunityRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new market-gaps page
    router.replace('/market-gaps');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-xl font-medium text-gray-700">Redirecting...</h1>
        <p className="text-gray-500 mt-2">
          The opportunity page has been moved to the new Market Gaps page.
        </p>
      </div>
    </div>
  );
}