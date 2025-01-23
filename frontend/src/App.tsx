import React, {useState, useEffect, useRef} from "react"
import axios from "axios"
import {SuggestionButton} from "./components/suggestion-button.tsx";
import './App.css'
import {TRANSACTIONS} from "./mock-data.ts";

const initialFilterState = {
    startDateFilter: "",
    endDateFilter: "",
    minAmountFilter: "",
    maxAmountFilter: "",
    typeFilter: "all",
    categoryFilter: "all",
}

// Fake transaction data (unchanged)
const allSuggestions = [
    'Show me my gas expenses',
    'Can I see my travel expenses for this month?',
    'When did I get my salary?',
    'When did I spend money on groceries? more than 15$',
]



function AppDashboard() {
    const [filteredTransactions, setFilteredTransactions] = useState(TRANSACTIONS)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [minAmountFilter, setminAmountFilter] = useState("")
    const [maxAmountFilter, setmaxAmountFilter] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [filterSummary, setFilterSummary] = useState("")
    const [chatInput, setChatInput] = useState("")
    const [isLoading, setIsLoading] = useState(false) // Added loading state
    const [suggestions, setSuggestions] = useState(allSuggestions)
    const canvasRef = useRef(null)

    useEffect(() => {
        applyFilters()
    }, [startDate, endDate, minAmountFilter, maxAmountFilter, typeFilter, categoryFilter])

    useEffect(() => {
        drawPieChart()
    }, [filteredTransactions])

    const applyFilters = () => {
        const filtered = TRANSACTIONS.filter((transaction) => {
            const transactionDate = new Date(transaction.date)
            const startDateObject = startDate ? new Date(startDate) : new Date(0)
            const endDateObject = endDate ? new Date(endDate) : new Date()
            const properminAmountFilter = (minAmountFilter === undefined || minAmountFilter) === null ? "" : minAmountFilter
            const propermaxAmountFilter = (maxAmountFilter === undefined || maxAmountFilter === null) ? "" : maxAmountFilter
            return (
                transactionDate >= startDateObject &&
                transactionDate <= endDateObject &&
                (properminAmountFilter === "" || Math.abs(transaction.amount) >= Number.parseFloat(properminAmountFilter)) &&
                (propermaxAmountFilter === "" || Math.abs(transaction.amount) <= Number.parseFloat(propermaxAmountFilter)) &&
                (typeFilter === "all" || transaction.type === typeFilter) &&
                (categoryFilter === "all" || transaction.category === categoryFilter)
            )
        })
        setFilteredTransactions(filtered)
    }

    const resetFilters = () => {
        setFilters(initialFilterState)
        setFilterSummary("")
    }

    const setFilters = (filters) => {
        setStartDate(filters.startDateFilter)
        setEndDate(filters.endDateFilter)
        setminAmountFilter(filters.minAmountFilter)
        setmaxAmountFilter(filters.maxAmountFilter)
        setTypeFilter(filters.typeFilter)
        setCategoryFilter(filters.categoryFilter)

    }

    const drawPieChart = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = Math.min(centerX, centerY) - 10

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
            if (transaction.type === "expense") {
                acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount)
            }
            return acc
        }, {})

        const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

        const colors = {
            groceries: "#FF6384",
            travel: "#36A2EB",
            gas: "#FFCE56",
            salary: "#4BC0C0",
            freelance: "#9966FF",
        }

        let startAngle = 0
        Object.entries(categoryTotals).forEach(([category, amount]) => {
            const sliceAngle = (amount / totalAmount) * 2 * Math.PI

            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
            ctx.closePath()

            ctx.fillStyle = colors[category] || "#CCCCCC"
            ctx.fill()

            startAngle += sliceAngle
        })

        const legendX = 10
        let legendY = 20
        ctx.font = "12px Arial"
        Object.entries(categoryTotals).forEach(([category, amount]) => {
            const percentage = ((amount / totalAmount) * 100).toFixed(1)
            ctx.fillStyle = colors[category] || "#CCCCCC"
            ctx.fillRect(legendX, legendY - 10, 20, 10)
            ctx.fillStyle = "#000"
            ctx.fillText(`${category}: ${percentage}%`, legendX + 25, legendY)
            legendY += 20
        })
    }

    const handleChatSubmit = async (e: any, prompt: string = "") => {
        if (e) {
            e.preventDefault()
        }
        setIsLoading(true) // Set loading to true
        console.log("loading...")
        try {
            const res = await axios.post(
                "http://localhost:5000/update-filter",
                {
                    currentFilter: {
                        startDateFilter: startDate,
                        endDateFilter: endDate,
                        minAmountFilter: minAmountFilter,
                        maxAmountFilter: maxAmountFilter,
                        typeFilter: typeFilter,
                        categoryFilter: categoryFilter,
                    },
                    prompt: prompt ? prompt : chatInput,
                },
                {withCredentials: true},
            )
            console.log(res.data)
            if (Array.from(Object.keys(res.data.filterSettings)).length > 0) {
                console.log("setting filter with ", res.data.filterSettings)
                setFilters(res.data.filterSettings)
            }
            setFilterSummary(res.data.response)
            setChatInput("")
        } catch (error) {
            console.error("Error updating filters:", error)
        } finally {
            setIsLoading(false) // Set loading to false
            console.log("done")
        }
    }

    const spinKeyframes = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`

    return (
        <>
            <style>{spinKeyframes}</style>
            <div
                style={{
                    fontFamily: "Arial, sans-serif",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "20px",
                    backgroundColor: "#f0f0f0",
                }}
            >
                <h1 style={{color: "#333", textAlign: "center"}}></h1>

                <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "5px",
                        marginBottom: "20px",
                    }}
                >
                    <form onSubmit={(e) => handleChatSubmit(e)} style={{display: "flex", marginBottom: "20px"}}>
                        <input
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
                            Send
                        </button>
                    </form>
                    <div style={{width:"100%",textAlign:"center",color:"#444"}}>Try these suggestions</div>
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",  // Allows wrapping to multiple lines
                        justifyContent: "center", // Centers the buttons
                        alignItems: "center",
                        gap: "3px",  // Adds spacing between buttons
                        marginBottom: "20px"
                    }}>
                        {
                            suggestions.map((suggestion: string) => {
                                return (<SuggestionButton suggestion={suggestion} clickHandler={handleChatSubmit}/>)

                            })
                        }
                        {/*<SuggestionButton suggestion={"Show me gas expenses"} clickHandler={handleChatSubmit}/>*/}
                        {/*<SuggestionButton suggestion={"Can I see salaries for this month?"} clickHandler={handleChatSubmit}/>*/}
                        {/*<SuggestionButton suggestion={"I wanna see travel expenses from january"} clickHandler={handleChatSubmit}/>*/}
                    </div>
                    <div style={{height: 50}}>
                        <div
                            style={{display: isLoading ? "flex" : "none", alignItems: "center", marginBottom: "10px",}}>
                            <div
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    border: "2px solid #f3f3f3",
                                    borderTop: "2px solid #3498db",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                    marginRight: "10px",
                                }}
                            ></div>
                            <span>Working...</span>
                        </div>
                        <div
                            style={{display: isLoading ? "none" : "flex", alignItems: "center", marginBottom: "10px",}}>
                            <span>{filterSummary}<span>{filterSummary ? <button onClick={resetFilters}
                                                                                className='reset-button'
                                                                                style={{marginLeft: "1em"}}>Reset</button> : ""}</span></span>
                        </div>
                    </div>
                    {/*<h2 style={{color: "#4a4a4a", marginBottom: "10px"}}>Filters</h2>*/}
                    <div style={{display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px"}}>
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
                            placeholder="Minimum Amount"
                            value={minAmountFilter}
                            onChange={(e) => setminAmountFilter(e.target.value)}
                            style={{padding: "5px", borderRadius: "3px", border: "1px solid #ccc"}}
                        />
                        <input
                            type="number"
                            placeholder="Maximum Amount"
                            value={maxAmountFilter}
                            onChange={(e) => setmaxAmountFilter(e.target.value)}
                            style={{padding: "5px", borderRadius: "3px", border: "1px solid #ccc"}}
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
                            {
                                ["All Categories", ...Array.from(new Set(TRANSACTIONS.map(t => t.category)))].map((item, i) => (
                                    <option value={i === 0 ? "all" : item}
                                            key={"option-key-" + item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
                                ))
                            }

                        </select>
                        <button
                            onClick={resetFilters}
                            className={'reset-button'}
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div style={{display: "flex", gap: "20px"}}>
                    <div
                        style={{
                            flex: 1,
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "5px",
                        }}
                    >
                        {/*<h2 style={{color: "#4a4a4a", marginBottom: "10px"}}>Expense Breakdown</h2>*/}
                        <canvas ref={canvasRef} width="400" height="300"
                                style={{margin: "0 auto", display: "block"}}></canvas>
                    </div>

                    <div
                        className='scrollable-section'
                        style={{
                            flex: 1,
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "5px",
                            maxHeight: "500px",
                            // overflowY: "auto",
                        }}
                    >
                        {/*<h2 style={{color: "#4a4a4a", marginBottom: "10px"}}>Transaction History</h2>*/}
                        {filteredTransactions.length === 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "200px",
                                    color: "#888",
                                    fontSize: "18px",
                                    fontStyle: "italic",
                                }}
                            >
                                No results found
                            </div>
                        ) : (
                            filteredTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    style={{
                                        borderBottom: "1px solid #eee",
                                        padding: "10px 0",
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span>{transaction.date}</span>
                                    <span>{transaction.description}</span>
                                    <span style={{color: transaction.type === "income" ? "green" : "red"}}>
                    {transaction.type === "income" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                                    <span>{transaction.category}</span>
                                </div>
                            ))
                        )}                    </div>
                </div>
            </div>
        </>
    )
}

export default AppDashboard

