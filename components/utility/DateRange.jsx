"use client";

import { useState, useEffect, useMemo } from 'react';

// Move months outside component for better performance
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DateRange = ({ startYear, endYear, id }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Memoize formatted dates for better performance
    const formattedDates = useMemo(() => {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            // Check if the date is invalid or just the year
            if (isNaN(date.getTime()) || dateString.length <= 4) {
                // Return just the year or the original string if it's not a full date
                return dateString ? String(date.getFullYear() || dateString) : 'Present';
            }
            return `${months[date.getMonth()]}, ${date.getFullYear()}`;
        };

        return {
            start: formatDate(startYear),
            end: endYear ? formatDate(endYear) : 'Present'
        };
    }, [startYear, endYear]);

    // Consolidate the rendering into a single non-paragraph element (<span>)
    // to prevent the nested <p> error, regardless of SSR or client-side rendering.
    
    if (!isClient) {
        // Return a simple fallback during SSR using basic year format
        // Note: The logic here is simplified to avoid complex month calculations if running in SSR,
        // matching the previous behavior but using <span>.
        const startYearNum = new Date(startYear).getFullYear();
        const endYearNum = endYear ? new Date(endYear).getFullYear() : 'Present';
        
        // FIX: Using <span> instead of <p> for SSR fallback
        return (
            <span id={id} className="sub-content">
                {startYearNum} - {endYearNum}
            </span>
        );
    }
    
    // FIX: Changed <p> to <span> to resolve the nested <p> error
    return (
        <span id={id} className="sub-content">
            {formattedDates.start} - {formattedDates.end}
        </span>
    );
};

export default DateRange;