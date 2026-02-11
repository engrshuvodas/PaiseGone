/** Software Version: 2.3 | Dev: Engr Shuvo Das **/
import React, { createContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';

export const AppContext = createContext();

const initialMembers = [
    { id: '1', name: 'Shuvo' },
    { id: '2', name: 'Animesh' },
    { id: '3', name: 'Utshab' },
    { id: '4', name: 'Sajib' },
    { id: '5', name: 'Dipto' },
];

const initialExpenses = [];
const initialMeals = [];
const defaultCategories = [
    { id: 'bajar', name: 'Bazaar/Grocery', icon: '🛒', color: '#ff4d4f' },
    { id: 'rent', name: 'House Rent', icon: '🏠', color: '#1890ff' },
    { id: 'utility', name: 'Utilities (Gas/Water)', icon: '⚡', color: '#faad14' },
    { id: 'internet', name: 'Internet/WiFi', icon: '🌐', color: '#722ed1' },
    { id: 'chef', name: 'Chef/Helper Salary', icon: '👨‍🍳', color: '#52c41a' },
    { id: 'others', name: 'Others', icon: '✨', color: '#8c8c8c' },
];

export const AppProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem('bb_settings');
            return saved ? JSON.parse(saved) : {
                currency: '₹',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
                theme: 'system'
            };
        } catch (e) {
            return { currency: '₹', timezone: 'UTC', theme: 'system' };
        }
    });

    const [resolvedTheme, setResolvedTheme] = useState('light');

    useEffect(() => {
        const updateResolvedTheme = () => {
            if (settings.theme === 'system') {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setResolvedTheme(isDark ? 'dark' : 'light');
            } else {
                setResolvedTheme(settings.theme);
            }
        };

        updateResolvedTheme();

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
            if (settings.theme === 'system') {
                updateResolvedTheme();
            }
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [settings.theme]);

    useEffect(() => {
        if (resolvedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [resolvedTheme]);

    const [members, setMembers] = useState(() => {
        try {
            const saved = localStorage.getItem('bb_members');
            return saved ? JSON.parse(saved) : initialMembers;
        } catch (e) {
            return initialMembers;
        }
    });

    const [expenses, setExpenses] = useState(() => {
        try {
            const saved = localStorage.getItem('bb_expenses');
            return saved ? JSON.parse(saved) : initialExpenses;
        } catch (e) {
            return initialExpenses;
        }
    });

    const [meals, setMeals] = useState(() => {
        try {
            const saved = localStorage.getItem('bb_meals');
            return saved ? JSON.parse(saved) : initialMeals;
        } catch (e) {
            return initialMeals;
        }
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        try {
            const auth = localStorage.getItem('bb_auth');
            return auth === 'true';
        } catch (e) {
            return false;
        }
    });

    // Listen for storage changes in other tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'bb_auth') {
                setIsAuthenticated(e.newValue === 'true');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        localStorage.setItem('bb_settings', JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        localStorage.setItem('bb_members', JSON.stringify(members));
    }, [members]);

    useEffect(() => {
        localStorage.setItem('bb_expenses', JSON.stringify(expenses));
    }, [expenses]);

    useEffect(() => {
        localStorage.setItem('bb_meals', JSON.stringify(meals));
    }, [meals]);

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

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
        localStorage.setItem('bb_auth', 'false');
    };

    const addExpense = (newExpense) => {
        const expenseWithId = { ...newExpense, id: Date.now().toString() };
        setExpenses([expenseWithId, ...expenses]);
        return Promise.resolve(expenseWithId);
    };

    const updateExpense = (updatedExpense) => {
        setExpenses(expenses.map(ex => ex.id === updatedExpense.id ? updatedExpense : ex));
        return Promise.resolve(updatedExpense);
    };

    const deleteExpense = (id) => {
        setExpenses(expenses.filter(ex => ex.id !== id));
        return Promise.resolve();
    };

    const addMember = (name, phone = '') => {
        const newMember = { id: Date.now().toString(), name, phone };
        setMembers([...members, newMember]);
        return Promise.resolve(newMember);
    };

    const updateMember = (id, name, phone) => {
        setMembers(members.map(m => m.id === id ? { ...m, name, phone } : m));
        return Promise.resolve();
    };

    const deleteMember = (id) => {
        setMembers(members.filter(m => m.id !== id));
        return Promise.resolve();
    };

    const addMeal = (date, mealData) => {
        const newMeal = { id: Date.now().toString(), date, meals: mealData };
        // Check if date already exists
        const existingIdx = meals.findIndex(m => m.date === date);
        if (existingIdx !== -1) {
            const updatedMeals = [...meals];
            updatedMeals[existingIdx] = newMeal;
            setMeals(updatedMeals);
        } else {
            setMeals([newMeal, ...meals]);
        }
        return Promise.resolve(newMeal);
    };

    const deleteMeal = (id) => {
        setMeals(meals.filter(m => m.id !== id));
        return Promise.resolve();
    };

    return (
        <AppContext.Provider value={{
            members,
            expenses,
            setExpenses,
            meals,
            setMeals,
            categories: defaultCategories,
            isAuthenticated,
            settings,
            resolvedTheme,
            updateSettings,
            login,
            logout,
            addExpense,
            updateExpense,
            deleteExpense,
            addMember,
            updateMember,
            deleteMember,
            addMeal,
            deleteMeal
        }}>
            {children}
        </AppContext.Provider>
    );
};
