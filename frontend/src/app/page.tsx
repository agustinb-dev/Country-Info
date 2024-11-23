import Link from 'next/link';
import { AvailableCountry } from "@/types/Country";

export default async function CountriesPage() {
    // Fetching the list of countries
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/country/available', {
        next: { revalidate: 86400 },
    });
    const countries: AvailableCountry[] = await res.json();

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Title */}
            <h1 className="text-5xl font-extrabold text-center text-white mb-8">Countries</h1>

            {/* Countries List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {countries.map((country) => (
                    <Link
                        key={country.countryCode}
                        href={`/${country.countryCode}`}
                        className="bg-white shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 rounded-lg overflow-hidden"
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800">{country.name}</h2>
                            <p className="text-sm text-gray-500 mt-2">{country.countryCode}</p>
                        </div>
                        <div className="bg-gray-100 p-4">
                            <button className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-300">
                                View Details
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
