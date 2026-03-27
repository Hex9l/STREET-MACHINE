import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
    const [compareList, setCompareList] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('streetmachine_compare');
        if (stored) {
            setCompareList(JSON.parse(stored));
        }
    }, []);

    const addToCompare = (vehicle) => {
        if (compareList.find(v => v._id === vehicle._id)) {
            toast.error("Vehicle already in comparison");
            return;
        }
        
        const isMobile = window.innerWidth < 768;
        const maxLimit = isMobile ? 2 : 3;
        
        if (compareList.length >= maxLimit) {
            toast.error(`Comparison limit reached (Max ${maxLimit} on mobile)`);
            return;
        }
        const updated = [...compareList, vehicle];
        setCompareList(updated);
        localStorage.setItem('streetmachine_compare', JSON.stringify(updated));
        toast.success(`${vehicle.name} added to compare`);
    };

    const removeFromCompare = (id) => {
        const updated = compareList.filter(v => v._id !== id);
        setCompareList(updated);
        localStorage.setItem('streetmachine_compare', JSON.stringify(updated));
        toast.success("Vehicle removed from comparison");
    };

    const clearComparison = () => {
        setCompareList([]);
        localStorage.removeItem('streetmachine_compare');
        toast.success("Comparison matrix cleared");
    };

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearComparison }}>
            {children}
        </CompareContext.Provider>
    );
};
