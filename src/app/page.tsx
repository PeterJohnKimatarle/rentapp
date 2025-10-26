import Layout from '@/components/Layout';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/data/properties';

export default function Home() {
  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
