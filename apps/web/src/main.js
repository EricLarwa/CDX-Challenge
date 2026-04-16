import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
const queryClient = new QueryClient();
function App() {
    return (_jsxs("main", { style: { fontFamily: 'sans-serif', padding: '2rem' }, children: [_jsx("h1", { children: "FinanceOS" }), _jsx("p", { children: "Foundation scaffold is live. API and UI modules come next." })] }));
}
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(BrowserRouter, { children: _jsx(App, {}) }) }) }));
