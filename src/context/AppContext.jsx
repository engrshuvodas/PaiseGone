import React, { createContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';

export const AppContext = createContext();

const initialMembers = [
    { id: '1', name: 'Shuvo Das' },
    { id: '2', name: 'Rahim Ahmed' },
    { id: '3', name: 'Asif Karim' },
    { id: '4', name: 'Milon Hossain' },
    { id: '5', name: 'Tanvir Islam' },
];

const initialExpenses = [
    {
        id: '1',
        date: dayjs().format('YYYY-MM-01'),
        details: 'Rice 25kg, Soya Oil 5L',
        cost: 3500,
        addedBy: ['Shuvo Das'],
    },
    {
        id: '2',
        date: dayjs().format('YYYY-MM-02'),
        details: 'Chicken 4kg, Eggs 2 Dozen',
        cost: 1200,
        addedBy: ['Rahim Ahmed', 'Asif Karim'],
    },
];

export const AppProvider = ({ children }) => {
    const [members, setMembers] = useState(() => {
        const saved = localStorage.getItem('bb_members');
        return saved ? JSON.parse(saved) : initialMembers;
    });

    const [expenses, setExpenses] = useState(() => {
        const saved = localStorage.getItem('bb_expenses');
        return saved ? JSON.parse(saved) : initialExpenses;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('bb_auth') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('bb_members', JSON.stringify(members));
    }, [members]);

    useEffect(() => {
        localStorage.setItem('bb_expenses', JSON.stringify(expenses));
    }, [expenses]);

    const login = (username, password) => {
        if (username === 'admin' && password === 'admin') {
            setIsAuthenticated(true);
            localStorage.setItem('bb_auth', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('bb_auth');
    };

    const addExpense = (newExpense) => {
        const expenseWithId = { ...newExpense, id: Date.now().toString() };
        setExpenses([expenseWithId, ...expenses]);
        return Promise.resolve(expenseWithId);
    };

    const addMember = (name) => {
        const newMember = { id: Date.now().toString(), name };
        setMembers([...members, newMember]);
        return Promise.resolve(newMember);
    };

    const updateMember = (id, name) => {
        setMembers(members.map(m => m.id === id ? { ...m, name } : m));
        return Promise.resolve();
    };

    const deleteMember = (id) => {
        setMembers(members.filter(m => m.id !== id));
        return Promise.resolve();
    };

    return (
        <AppContext.Provider value={{
            members,
            expenses,
            isAuthenticated,
            login,
            logout,
            addExpense,
            addMember,
            updateMember,
            deleteMember
        }}>
            {children}
        </AppContext.Provider>
    );
};
