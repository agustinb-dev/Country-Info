'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { CountryInfo } from "@/types/CountryInfo";
import { PopulationInfo } from "@/types/PopulationInfo";
import { Border } from "@/types/Border";
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
                    `http://localhost:3030/country/info?code=${countryCode}`
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
                    <img
                        src="/not-found.svg"
                        alt="Not Found"
                        className="w-48 mx-auto"
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

    console.log(countryDetails);


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
            <Link href="/" className="text-3xl absolute font-extrabold text-center text-white mb-8">
                Back </Link>
            <h1 className="text-5xl font-extrabold text-center text-white mb-8">
                {countryDetails.commonName}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Population Chart */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800">Population</h2>
                        <div className="h-72">
                            <Line data={chartData} />
                        </div>
                    </div>
                </div>

                {/* Border Countries */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800">Border Countries</h2>
                        <ul>
                            {countryDetails.borderCountries?.map((borderCountry: Border, index: number) => (
                                <li key={borderCountry.countryCode || index} className="text-lg text-gray-700">
                                    {borderCountry.commonName}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Flag */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800">Flag</h2>
                        <img src={countryDetails.flagUrl} alt={`${countryDetails.commonName} Flag`} className="w-full h-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
}
