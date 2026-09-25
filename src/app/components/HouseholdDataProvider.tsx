'use client';

import {
    createContext,
    useContext,
    useMemo,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from 'react';
import type {BudgetCsvRow} from '@/lib/csv';
import type {DefaultPaymentSource, PaymentSource} from '@/lib/cashFlow';

interface HouseholdDataContextValue {
    husbandIncome: number;
    setHusbandIncome: Dispatch<SetStateAction<number>>;
    wifeIncome: number;
    setWifeIncome: Dispatch<SetStateAction<number>>;
    budgetItems: BudgetCsvRow[];
    setBudgetItems: Dispatch<SetStateAction<BudgetCsvRow[]>>;
    paymentSources: Record<string, PaymentSource> | null;
    setPaymentSources: (sources: Record<string, PaymentSource>) => void;
    defaultPaymentSource: DefaultPaymentSource;
    setDefaultPaymentSource: (source: DefaultPaymentSource) => void;
}

interface HouseholdDataProviderProps {
    children: ReactNode;
    husbandIncomeDefault: number;
    wifeIncomeDefault: number;
    budgetItemsDefault: BudgetCsvRow[];
}

const HouseholdDataContext = createContext<HouseholdDataContextValue | undefined>(undefined);

export function HouseholdDataProvider({
    children,
    husbandIncomeDefault,
    wifeIncomeDefault,
    budgetItemsDefault,
}: Readonly<HouseholdDataProviderProps>) {
    const [husbandIncome, setHusbandIncome] = useState(husbandIncomeDefault);
    const [wifeIncome, setWifeIncome] = useState(wifeIncomeDefault);
    const [budgetItems, setBudgetItems] = useState(budgetItemsDefault);
    const [paymentSources, setPaymentSources] = useState<Record<string, PaymentSource> | null>(null);
    const [defaultPaymentSource, setDefaultPaymentSource] = useState<DefaultPaymentSource>('husband');

    const value = useMemo(() => ({
        husbandIncome,
        setHusbandIncome,
        wifeIncome,
        setWifeIncome,
        budgetItems,
        setBudgetItems,
        paymentSources,
        setPaymentSources,
        defaultPaymentSource,
        setDefaultPaymentSource,
    }), [husbandIncome, wifeIncome, budgetItems, paymentSources, defaultPaymentSource]);

    return (
        <HouseholdDataContext.Provider value={value}>
            {children}
        </HouseholdDataContext.Provider>
    );
}

export function useHouseholdData() {
    const context = useContext(HouseholdDataContext);
    if (context === undefined) {
        throw new Error('useHouseholdData must be used within a HouseholdDataProvider');
    }
    return context;
}
