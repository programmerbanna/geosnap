"use client";
import React, { useState } from 'react';
import styles from './map-search.module.scss';
import { useMap } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';

interface SearchResult {
    boundingbox: [string, string, string, string];
    display_name: string;
}

const MapSearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const map = useMap();

    const handleSearch = async () => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`
            );
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleSelect = (result: SearchResult) => {
        const [south, north, west, east] = result.boundingbox.map(Number);
        const bounds = new LatLngBounds([south, west], [north, east]);
        map.fitBounds(bounds);
        setResults([]);
        setSearchTerm('');
    };

    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search location..."
                />
                <button onClick={handleSearch}>🔍</button>
            </div>
            {results.length > 0 && (
                <div className={styles.results}>
                    {results.map((result, index) => (
                        <div
                            key={index}
                            className={styles.resultItem}
                            onClick={() => handleSelect(result)}
                        >
                            {result.display_name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MapSearch;