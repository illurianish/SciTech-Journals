import { useRouter } from 'next/router';
import CommercialFinancialHub from '@/components/financial/CommercialFinancialHub';

export default function PropertyFinancialPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Property Financial Analysis</h1>
      
      {id ? (
        <CommercialFinancialHub propertyId={id} />
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
          Loading property data...
        </div>
      )}
    </div>
  );
} 