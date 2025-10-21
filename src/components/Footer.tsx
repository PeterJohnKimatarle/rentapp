'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile: Original layout - only for very small devices (smartphones) */}
        <div className="text-center lg:hidden">
          <p className="text-sm text-gray-600">© {currentYear} Rentapp Limited</p>
          <p className="text-sm text-gray-600 mt-0.5">Tanzania&apos;s #1 Renting Platform</p>
          <p className="text-sm text-gray-600 mt-0.5">All Rights Reserved.</p>
          <p className="text-sm text-gray-600 mt-0.5">Contact: 0755-123-500</p>
        </div>

        {/* Tablet and Desktop: Combined layout */}
        <div className="hidden lg:block text-center">
          <p className="text-sm text-gray-600">© {currentYear} Rentapp Limited - Tanzania&apos;s #1 Renting Platform</p>
          <p className="text-sm text-gray-600 mt-0.5">All Rights Reserved. Contact: 0755-123-500</p>
        </div>
      </div>
    </footer>
  );
}

