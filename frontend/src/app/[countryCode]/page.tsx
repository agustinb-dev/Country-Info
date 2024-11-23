'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { CountryInfo } from "@/types/CountryInfo";
import { PopulationInfo } from "@/types/PopulationInfo";
import { Border } from "@/types/Border";
import Image from 'next/image'
import Link from "next/link";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function CountryPage() {
    const pathname = usePathname();
    const countryCode = pathname.split('/')[1];

    const [countryDetails, setCountryDetails] = useState<CountryInfo | undefined>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!countryCode) return; // Ensure that both code and name are available

        async function fetchCountryDetails() {
            try {
                // Fetch country details from the API
                const response = await fetch(
                    process.env.NEXT_PUBLIC_API_URL + `/country/info?code=${countryCode}`
                );

                setCountryDetails(!response.ok ? undefined : await response.json());

            } catch (error) {
                console.error('Failed to fetch country details:', error);
            } finally {
                setLoading(false);
            }
        }

        void fetchCountryDetails();
    }, [countryCode]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
                    <p className="text-lg font-medium text-gray-700">
                        Please wait, we’re gathering all the country details for you!
                    </p>
                </div>
            </div>
        );
    }


    if (!countryDetails) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-center space-y-4">
                    <Image
                        src="/not-found.svg"
                        alt="Not Found"
                        className="w-48 mx-auto"
                        width={100}
                        height={100}
                    />
                    <h2 className="text-2xl font-bold text-gray-800">
                        Oops! We couldn&#39;t find the country you’re looking for.
                    </h2>
                    <p className="text-gray-600">
                        It seems like the country code is invalid or unavailable at the moment.
                        Double-check the URL or try again later.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Prepare population chart data
    const populationLabels = countryDetails.populationData?.map((data: PopulationInfo) => data.year);
    const populationValues = countryDetails.populationData?.map((data: PopulationInfo) => data.value);

    const chartData = {
        labels: populationLabels,
        datasets: [
            {
                label: 'Population over the years',
                data: populationValues,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Back Button */}
            <Link href="/" className="text-xl font-semibold text-teal-500 hover:underline mb-4 inline-block">
                ← Back
            </Link>

            {/* Country Name and Flag */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-20 sm:w-48 sm:h-32 relative">
                    <Image
                        src={countryDetails.flagUrl}
                        alt={`${countryDetails.commonName} Flag`}
                        fill
                        className="object-cover rounded-lg shadow-md"
                    />
                </div>
                <h1 className="text-5xl font-extrabold text-white text-center sm:text-left">
                    {countryDetails.commonName}
                </h1>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Population Chart */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Population Over Time</h2>
                        <div className="h-72">
                            <Line data={chartData} />
                        </div>
                    </div>
                </div>

                {/* Border Countries Widget */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Border Countries</h2>
                        <ul className="space-y-2">
                            {countryDetails.borderCountries?.map((borderCountry: Border, index: number) => (
                                <li key={borderCountry.countryCode || index}>
                                    <Link
                                        href={`/${borderCountry.countryCode}`}
                                        className="text-teal-500 hover:underline text-lg"
                                    >
                                        {borderCountry.commonName}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
