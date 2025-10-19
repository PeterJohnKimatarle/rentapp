'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="text-center">
        <p className="text-sm text-gray-600">© {currentYear} Rentapp Limited</p>
        <p className="text-sm text-gray-600 mt-0.5">Contact: 0755-123-500</p>
      </div>
    </footer>
  );
}

