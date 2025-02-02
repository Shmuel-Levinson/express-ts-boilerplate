import React, {useState, useEffect, useRef} from "react"
import axios from "axios"
import "./App.css"
import {TRANSACTIONS} from "./mock-data.ts"
import {isEmpty} from "./utils/object-utils.ts"
import Accounts from './components/Accounts';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import {Loader} from './components/Loader';
import {generateColor, generatePastelColor} from './utils/color-utils';
import {allSuggestions} from './data/suggestions';
import TransactionList from "./components/TransactionList.tsx";
import {TextWidget} from './components/TextWidget';

const initialFilterState = {
    startDateFilter: "",
    endDateFilter: "",
    minAmountFilter: "",
    maxAmountFilter: "",
    typeFilter: "all",
    categoryFilter: "all",
    paymentMethodFilter: "all",
}

export interface Widget {
    id: string;
    gridArea: string;
    type: 'pie-chart' | 'bar-graph' | 'text';
    color?: string;
    name: string;
    groupBy?: 'category' | 'paymentMethod' | 'type';
    data?: any;
}

export interface Settings {
    density: 'comfortable' | 'cozy' | 'compact';
    notifications: {
        email: boolean;
        push: boolean;
        desktop: boolean;
    };
    security: {
        twoFactorAuth: boolean;
        loginAlerts: boolean;
    };
    display: {
        showToolbar: boolean;
        enableAnimations: boolean;
        showStatusBar: boolean;
    };
}

const lightTheme = {
    background: '#ffffff',
    surface: '#f5f5f5',
    surface2: '#e8e8e8',
    text: '#000000',
    border: '#cccccc',
    primary: '#007bff'
};

const darkTheme = {
    background: '#121212',
    surface: '#1e1e1e',
    surface2: '#2d2d2d',
    text: '#ffffff',
    border: '#404040',
    primary: '#007bff'
};

interface ResponseModal {
    isOpen: boolean;
    responses: string[];
}

function App() {
    const [filteredTransactions, setFilteredTransactions] = useState(TRANSACTIONS)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [minAmountFilter, setminAmountFilter] = useState("")
    const [maxAmountFilter, setmaxAmountFilter] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
    const [parserResponse, setParserResponse] = useState("")
    const [agentsResponses, setAgentsResponses] = useState<string[]>([])
    const [chatInput, setChatInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [allShuffledSuggestions, setAllShuffledSuggestions] = useState([...allSuggestions])
    const [visibleSuggestions, setVisibleSuggestions] = useState(allSuggestions.slice(0, 2))
    const canvasRef = useRef(null)
    const [currentPage, setCurrentPage] = useState("transactions")
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [widgets, setWidgets] = useState<Widget[]>([
        // {
        //     id: '1',
        //     type: 'text',
        //     data: { text: 'Welcome to your financial dashboard!' },
        //     gridArea: '1 / 1',
        //     name: 'Welcome Message',
        // },
        // {
        //     id: '2',
        //     type: 'pie-chart',
        //     gridArea: '1 / 2',
        //     name: 'Payment Menthods',
        //     color: generatePastelColor(),
        //     groupBy: 'paymentMethod',
        // },
        // {
        //     id: '3',
        //     type: 'bar-graph',
        //     gridArea: '2 / 1',
        //     name: 'Payment Methods',
        //     color: generatePastelColor(),
        //     groupBy: 'paymentMethod',
        // },
        // {
        //     id: '4',
        //     type: 'text',
        //     data: { text: 'Track your monthly spending goals here...' },
        //     gridArea: '2 / 2',
        //     name: 'Goals Tracker',
        // }
    ]);
    const [theme, setTheme] = useState<string>('light');
    const [settings, setSettings] = useState<Settings>({
        density: 'comfortable',
        notifications: {
            email: true,
            push: false,
            desktop: true,
        },
        security: {
            twoFactorAuth: false,
            loginAlerts: true,
        },
        display: {
            showToolbar: true,
            enableAnimations: true,
            showStatusBar: true,
        }
    });
    const [showChat, setShowChat] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [responseModal, setResponseModal] = useState<ResponseModal>({
        isOpen: false,
        responses: [],
    });

    const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

    const Agents: Record<string, { augmentWithContext: Function, resolve: Function }> = {
        "Transaction Filters Agent": {
            augmentWithContext: (task: any) => {
                return {
                    ...task,
                    context: {
                        currentFilter: {
                            startDateFilter: startDate,
                            endDateFilter: endDate,
                            minAmountFilter: minAmountFilter,
                            maxAmountFilter: maxAmountFilter,
                            typeFilter: typeFilter,
                            categoryFilter: categoryFilter,
                            paymentMethodFilter: paymentMethodFilter,
                        }

                    }

                }
            },
            resolve: (task: any) => {
                setFilters(task.response.filterSettings);
            }
        },
        "Navigation Agent": {
            augmentWithContext: (task: any) => {
                return {
                    ...task,
                    context: {
                        currentPage: currentPage
                    }
                }
            },
            resolve: (task: any) => {
                console.log("NAVIGATION SIMULATION!", task.response.page)
                setCurrentPage(task.response.page)
            }
        },
        "Dashboard Agent": {
            augmentWithContext: (task: any) => {
                return {
                    ...task,
                    context: {
                        dashboardState: widgets
                    }
                }
            },
            resolve: (task: any) => {
                console.log("DASHBOARD SIMULATION!", task.response.dashboardState)
                setWidgets(task.response.dashboardState)
            }
        }
    }

    useEffect(() => {
        applyFilters()
    }, [startDate, endDate, minAmountFilter, maxAmountFilter, typeFilter, categoryFilter, paymentMethodFilter])

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                setShowChat(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    useEffect(() => {
        if (showChat && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showChat]);

    const applyFilters = () => {
        const filtered = TRANSACTIONS.filter((transaction) => {
            const transactionDate = new Date(transaction.date)
            const startDateObject = startDate ? new Date(startDate) : new Date(0)
            const endDateObject = endDate ? new Date(endDate) : new Date()
            const properminAmountFilter = (minAmountFilter === undefined || minAmountFilter) === null ? "" : minAmountFilter
            const propermaxAmountFilter = maxAmountFilter === undefined || maxAmountFilter === null ? "" : maxAmountFilter
            return (
                transactionDate >= startDateObject &&
                transactionDate <= endDateObject &&
                (properminAmountFilter === "" || Math.abs(transaction.amount) >= Number.parseFloat(properminAmountFilter)) &&
                (propermaxAmountFilter === "" || Math.abs(transaction.amount) <= Number.parseFloat(propermaxAmountFilter)) &&
                (typeFilter === "all" || transaction.type === typeFilter) &&
                (categoryFilter === "all" || transaction.category === categoryFilter) &&
                (paymentMethodFilter === "all" || transaction.paymentMethod === paymentMethodFilter)
            )
        })
        setFilteredTransactions(filtered)
    }

    const resetFilters = () => {
        setFilters(initialFilterState)

    }

    const setFilters = (filters: any) => {
        setStartDate(filters.startDateFilter)
        setEndDate(filters.endDateFilter)
        setminAmountFilter(filters.minAmountFilter)
        setmaxAmountFilter(filters.maxAmountFilter)
        setTypeFilter(filters.typeFilter)
        setCategoryFilter(filters.categoryFilter)
        setPaymentMethodFilter(filters.paymentMethodFilter)
    }

    const drawPieChart = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas!.getContext("2d")
        const centerX = canvas.width / 3
        const centerY = canvas.height / 3
        const radius = Math.min(centerX, centerY) - 10

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const categoryTotals = filteredTransactions.reduce((acc: Record<string, any>, transaction) => {
            acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount)
            return acc
        }, {})

        const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

        // Generate colors for each category
        const colors = {}
        Object.keys(categoryTotals).forEach((category, index) => {
            colors[category] = generateColor(index)
        })

        let startAngle = 0
        Object.entries(categoryTotals).forEach(([category, amount]) => {
            const sliceAngle = (amount / totalAmount) * 2 * Math.PI

            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
            ctx.closePath()

            ctx.fillStyle = colors[category]
            ctx.fill()

            startAngle += sliceAngle
        })

        // Draw legend (Positioned to the right of the pie)
        const legendX = centerX + radius + 20
        let legendY = 30
        ctx.font = "14px Arial"

        Object.entries(categoryTotals).forEach(([category, amount]) => {
            const percentage = ((amount / totalAmount) * 100).toFixed(1)

            // Legend color box
            ctx.fillStyle = colors[category]
            ctx.fillRect(legendX, legendY - 10, 14, 14)

            // Legend text
            ctx.fillStyle = "#000"
            ctx.fillText(`${category}: ${percentage}%`, legendX + 20, legendY + 2)

            legendY += 25
        })
    }

    const handleChatSubmit = async (e: any, prompt: string = "") => {
        if (e) {
            e.preventDefault()
        }
        setIsLoading(true)
        setParserResponse("")
        setAgentsResponses([])
        console.log("loading...")
        try {
            const parseUserPromptRes = await axios.post(
                "http://localhost:5000/parse-user-prompt",
                {
                    prompt: prompt ? prompt : chatInput,
                    context: {currentPage: currentPage}
                },
                {withCredentials: true},
            )
            const {response, agentTasks} = parseUserPromptRes.data
            if (!(response || agentTasks)) {
                setChatInput("")
                setParserResponse("Server error")
                return
            }
            setParserResponse(parseUserPromptRes.data.response)
            const augmentedTasks = agentTasks.map((task: { agent: string, prompt: string }) => {
                    const agent = Agents[task["agent"]]
                    if (agent?.augmentWithContext) {
                        return agent.augmentWithContext(task)
                    }
                    return task
                }
            )

            const agentExecutorRes = await axios.post("http://localhost:5000/agent-executor", augmentedTasks)
            const tasksForResolvers = agentExecutorRes.data
            if (tasksForResolvers.length < 1) {
                setIsLoading(false);
                return
            }
            tasksForResolvers.forEach((task, index) => {
                setTimeout(() => {
                    const agent = Agents[task.agent];
                    if (!agent) {
                        console.log("No agent found for task", task);
                        return;
                    }
                    agent.resolve(task);
                    const agentResponse = task.agent + ": " + task.response.response
                    if (index === tasksForResolvers.length - 1) {
                        setIsLoading(false)
                    }
                    setAgentsResponses(prev => [...prev, agentResponse])
                }, index * 1000);
            });


        } catch (error) {
            console.error("Error updating filters:", error)
        } finally {

            shuffleAndUpdateSuggestions()
            console.log("done")
        }
    }

    const shuffleAndUpdateSuggestions = () => {
        // const shuffled = shuffleArray([...allSuggestions])
        // setAllShuffledSuggestions(shuffled)
        // setVisibleSuggestions(shuffled.slice(0, 2))
    }

    const handleMoreSuggestions = () => {
        const currentLength = visibleSuggestions.length
        const nextSuggestions = allShuffledSuggestions.slice(currentLength, currentLength + 2)
        setVisibleSuggestions([...visibleSuggestions, ...nextSuggestions])
    }

    const spinKeyframes = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'transactions':
                return <TransactionList transactions={filteredTransactions} currentTheme={currentTheme}/>;
            case 'accounts':
                return <Accounts currentTheme={currentTheme}/>;
            case 'settings':
                return <Settings
                    settings={settings}
                    onSettingChange={(key: string, value: any) => {
                        setSettings(prev => ({
                            ...prev,
                            [key]: value
                        }));
                    }}
                    currentTheme={currentTheme}
                />;
            case 'dashboard':
                return <Dashboard
                    currentTheme={currentTheme}
                    widgets={widgets}
                    onAddWidget={handleAddWidget}
                    onRemoveWidget={handleRemoveWidget}
                    onUpdateWidgets={handleUpdateWidgets}
                    transactions={filteredTransactions}
                    updateWidgetText={updateWidgetText}
                />


            case 'profile':
                return <Profile currentTheme={currentTheme}/>;
            case 'notifications':
                return <Notifications currentTheme={currentTheme}/>;
            default:
                return <Dashboard
                    currentTheme={currentTheme}
                    widgets={widgets}
                    onAddWidget={handleAddWidget}
                    onRemoveWidget={handleRemoveWidget}
                    onUpdateWidgets={handleUpdateWidgets}
                    transactions={filteredTransactions}
                />;
        }
    };

    function filtersSection() {
        return <div
            style={{
                backgroundColor: currentTheme.surface,
                padding: "20px",
                borderRadius: "5px",
            }}
        >

            <div style={{display: "flex", flexWrap: "wrap", gap: "10px"}}>
                <input
                    type="date"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{padding: "5px", borderRadius: "3px", border: "1px solid #ccc"}}
                />
                <input
                    type="date"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{padding: "5px", borderRadius: "3px", border: "1px solid #ccc"}}
                />
                <input
                    type="number"
                    placeholder="Min Amount"
                    value={minAmountFilter}
                    onChange={(e) => setminAmountFilter(e.target.value)}
                    style={{padding: "5px", borderRadius: "3px", border: "1px solid #ccc", width: "8em"}}
                />
                <input
                    type="number"
                    placeholder="Max Amount"
                    value={maxAmountFilter}
                    onChange={(e) => setmaxAmountFilter(e.target.value)}
                    style={{padding: "5px", borderRadius: "3px", border: "1px solid #ccc", width: "8em"}}
                />
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    style={{padding: "5px", borderRadius: "3px", border: "1px solid #ccc"}}
                >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{padding: "5px", borderRadius: "3px", border: "1px solid #ccc"}}
                >
                    {["All Categories", ...Array.from(new Set(TRANSACTIONS.map((t) => t.category)))].map((item, i) => (
                        <option value={i === 0 ? "all" : item} key={"option-key-" + item}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </option>
                    ))}
                </select>
                <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    style={{padding: "5px", borderRadius: "3px", border: "1px solid #ccc"}}
                >
                    <option value="all">All Payment Methods</option>
                    <option value="card">Card</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="bank transfer">Bank Transfer</option>
                </select>
                <button onClick={resetFilters} className={"reset-button"}>
                    Reset
                </button>
            </div>
        </div>;
    }

    function transactionsListSection() {
        return <div style={{display: "flex"}}>
            {/* <div
                style={{
                    flex: 1,
                    backgroundColor: currentTheme.surface,
                    padding: "20px",
                    borderRadius: "5px",
                }}
            >
                <canvas ref={canvasRef} width="500" height="500"
                        style={{margin: "0 auto", display: "block"}}></canvas>
            </div> */}

            <div

                style={{
                    flex: 1,
                    backgroundColor: currentTheme.surface,
                    padding: "20px",
                    borderRadius: "5px",
                    maxHeight: "500px",
                }}
            >
                <TransactionList transactions={filteredTransactions} currentTheme={currentTheme}/>
            </div>
        </div>;
    }

    const handleAddWidget = (type: 'pie-chart' | 'bar-graph' | 'text', gridArea: string, color?: string) => {
        const newWidget: Widget = {
            id: Date.now().toString(),
            gridArea,
            type,
            color: color || generatePastelColor(),
            name: `New ${type}`,
            groupBy: type === 'pie-chart' ? 'category' : undefined,
            data: type === 'text' ? {text: ''} : undefined,
        };
        setWidgets([...(widgets || []), newWidget]);
    };

    const handleRemoveWidget = (id: string) => {
        setWidgets(widgets.filter(widget => widget.id !== id));
    };

    const handleUpdateWidgets = (newWidgets: Widget[]) => {
        setWidgets(newWidgets);
        console.log("widgets updated", newWidgets)
    };

    const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleWidgetNameChange = (id: string, newName: string) => {
        setWidgets(widgets.map(widget =>
            widget.id === id
                ? {...widget, name: newName}
                : widget
        ));
    };

    const updateWidgetText = (widgetId: string, newText: string) => {
        setWidgets(prevWidgets =>
            prevWidgets.map(widget =>
                widget.id === widgetId
                    ? {...widget, data: {...widget.data, text: newText}}
                    : widget
            )
        );
    };

    // Add theme toggle handler
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <>
            <style>{spinKeyframes}</style>
            <div style={{
                fontFamily: "Arial, sans-serif",
                maxWidth: "1200px",
                margin: "0 auto",
                boxSizing: "border-box",
                padding: "20px",
                backgroundColor: currentTheme.background,
                color: currentTheme.text,
                transition: "all 0.3s ease",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                overflow: "hidden"
            }}>
                {/* Theme Toggle - fixed height */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                    <button
                        onClick={toggleTheme}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            backgroundColor: "transparent",
                            color: currentTheme.text,
                            border: `1px solid ${currentTheme.border}`,
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        {theme === 'dark' ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
                    </button>
                </div>

                {/* Chat Form - fixed height */}
                {showChat && (
                    <form onSubmit={(e) => handleChatSubmit(e)} style={{
                        display: "flex",
                    }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="What would you like to do?"
                            style={{
                                flex: 1,
                                padding: "10px",
                                fontSize: "16px",
                                borderRadius: "5px 0 0 5px",
                                border: "1px solid #ccc",
                                borderRight: "none",
                                outline: "none",
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: "10px 20px",
                                fontSize: "16px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "0 5px 5px 0",
                                cursor: "pointer",
                            }}
                        >
                            {"➤"}
                        </button>
                    </form>
                )}

                {/* Response Area - fixed height */}
                {showChat && (
                    <div style={{
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px"
                    }}>
                        <div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <Loader isLoading={isLoading}/>
                                {parserResponse && (
                                    <>
                                        <span style={{
                                            fontSize: "14px",
                                            color: currentTheme.text,
                                        }}>
                                            {parserResponse}
                                        </span>
                                        {!isLoading && (
                                            <>
                                                <span
                                                    onClick={() => setResponseModal({
                                                        isOpen: true,
                                                        responses: [parserResponse, ...agentsResponses]
                                                    })}
                                                    style={{
                                                        fontSize: "14px",
                                                        cursor: "pointer",
                                                        backgroundColor: currentTheme.surface2,
                                                        padding: "6px 12px",
                                                        borderRadius: "4px",
                                                        transition: "all 0.2s ease",
                                                        border: `1px solid ${currentTheme.border}`,
                                                        color: currentTheme.text,
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    Show Details
                                                </span>
                                                <span
                                                    onClick={() => {
                                                        setParserResponse("");
                                                        setAgentsResponses([]);
                                                    }}
                                                    style={{
                                                        fontSize: "14px",
                                                        cursor: "pointer",
                                                        backgroundColor: currentTheme.surface2,
                                                        padding: "6px 12px",
                                                        borderRadius: "4px",
                                                        transition: "all 0.2s ease",
                                                        border: `1px solid ${currentTheme.border}`,
                                                        color: currentTheme.text,
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    Clear
                                                </span>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Area - takes remaining height */}
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    minHeight: 0,
                    overflow: "hidden"
                }}>
                    {/* Navigation */}
                    {<div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(6, 1fr)",
                        gap: "10px",
                        padding: "10px",
                        backgroundColor: currentTheme.surface,
                        borderRadius: "5px",
                    }}>
                        {["transactions", "accounts", "settings", "dashboard", "profile", "notifications"].map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                style={{
                                    padding: "10px",
                                    fontSize: "16px",
                                    backgroundColor: currentPage === page ? currentTheme.primary : "transparent",
                                    color: currentPage === page ? "white" : currentTheme.text,
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    width: "100%",
                                }}
                            >
                                {page.charAt(0).toUpperCase() + page.slice(1)}
                            </button>
                        ))}
                    </div>}

                    {/* Filters */}
                    {filtersSection()}

                    {/* Content Area - scrollable */}
                    <div style={{
                        flex: 1,
                        minHeight: 0,
                        overflow: "auto",
                        backgroundColor: currentTheme.surface,
                        borderRadius: "5px",
                        padding: "20px"
                    }}>
                        {renderCurrentPage()}
                    </div>
                </div>
            </div>

            {responseModal.isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: currentTheme.surface,
                        padding: "24px",
                        borderRadius: "8px",
                        maxWidth: "600px",
                        width: "90%",
                        maxHeight: "80vh",
                        overflow: "auto",
                        position: "relative",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}>
                        <button
                            onClick={() => setResponseModal({isOpen: false, responses: []})}
                            style={{
                                position: "absolute",
                                right: "16px",
                                top: "16px",
                                border: "none",
                                background: "none",
                                fontSize: "20px",
                                cursor: "pointer",
                                color: currentTheme.text,
                                padding: "4px 8px",
                            }}
                        >
                            ✕
                        </button>
                        <h2 style={{
                            marginBottom: "20px",
                            color: currentTheme.text,
                        }}>
                            AI Responses
                        </h2>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                            {responseModal.responses.map((response, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: "16px",
                                        backgroundColor: currentTheme.surface2,
                                        borderRadius: "6px",
                                        borderLeft: `4px solid ${index === 0 ? currentTheme.primary : '#666'}`,
                                        color: currentTheme.text,
                                    }}
                                >
                                    <div style={{
                                        fontSize: '12px',
                                        color: currentTheme.textMuted || '#666',
                                        marginBottom: '4px'
                                    }}>
                                        {index === 0 ? 'Parser Response' : `Agent Response ${index}`}
                                    </div>
                                    {response}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default App

