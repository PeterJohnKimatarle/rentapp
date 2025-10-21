import Layout from '@/components/Layout';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/data/properties';

export default function Home() {
  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto px-1 sm:px-2 lg:px-4">
        {/* Properties Grid */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
