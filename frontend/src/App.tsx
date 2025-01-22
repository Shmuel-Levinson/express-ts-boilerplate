import React, {useState, useEffect, useRef} from "react"
import axios from "axios"

const initialFilterState = {
    startDateFilter: "",
    endDateFilter: "",
    minAmountFilter: "",
    maxAmountFilter: "",
    typeFilter: "all",
    categoryFilter: "all",
}

// Fake transaction data (unchanged)
const transactions = [
    {id: 1, date: "2024-12-01", amount: -50.0, type: "expense", category: "groceries", description: "Supermarket", paymentMethod: "card"},
    {id: 2, date: "2024-12-02", amount: 1000.0, type: "income", category: "salary", description: "Monthly salary", paymentMethod: "bank transfer"},
    {id: 3, date: "2024-12-03", amount: -30.0, type: "expense", category: "travel", description: "Bus ticket", paymentMethod: "cash"},
    {id: 4, date: "2024-12-04", amount: -20.0, type: "expense", category: "gas", description: "Gas station", paymentMethod: "card"},
    {id: 5, date: "2024-12-05", amount: -15.0, type: "expense", category: "groceries", description: "Convenience store", paymentMethod: "cash"},
    {id: 6, date: "2024-12-06", amount: -40.0, type: "expense", category: "travel", description: "Taxi ride", paymentMethod: "cash"},
    {id: 7, date: "2024-12-07", amount: -25.0, type: "expense", category: "gas", description: "Gas station", paymentMethod: "card"},
    {id: 8, date: "2024-12-08", amount: -60.0, type: "expense", category: "groceries", description: "Supermarket", paymentMethod: "card"},
    {id: 9, date: "2024-12-09", amount: 500.0, type: "income", category: "freelance", description: "Freelance project", paymentMethod: "cheque"},
    {id: 10, date: "2024-12-10", amount: -35.0, type: "expense", category: "travel", description: "Train ticket", paymentMethod: "card"},
    {id: 11, date: "2024-12-11", amount: -22.0, type: "expense", category: "gas", description: "Gas station", paymentMethod: "cash"},
    {id: 12, date: "2024-12-12", amount: -45.0, type: "expense", category: "groceries", description: "Supermarket", paymentMethod: "card"},
    {id: 13, date: "2024-12-13", amount: -18.0, type: "expense", category: "travel", description: "Bus ticket", paymentMethod: "cash"},
    {id: 14, date: "2024-12-14", amount: -30.0, type: "expense", category: "gas", description: "Gas station", paymentMethod: "card"},
    {id: 15, date: "2024-12-15", amount: 1000.0, type: "income", category: "salary", description: "Monthly salary", paymentMethod: "bank transfer"},
    {id: 16, date: "2024-12-16", amount: -55.0, type: "expense", category: "groceries", description: "Supermarket", paymentMethod: "card"},
    {id: 17, date: "2024-12-17", amount: -28.0, type: "expense", category: "travel", description: "Taxi ride", paymentMethod: "cash"},
    {id: 18, date: "2024-12-18", amount: -20.0, type: "expense", category: "gas", description: "Gas station", paymentMethod: "card"},
    {id: 19, date: "2024-12-19", amount: -40.0, type: "expense", category: "groceries", description: "Supermarket", paymentMethod: "cheque"},
    {id: 20, date: "2024-12-20", amount: 300.0, type: "income", category: "freelance", description: "Small project", paymentMethod: "bank transfer"},
    {id: 21, date: "2024-12-21", amount: -120.0, type: "expense", category: "electronics", description: "Headphones", paymentMethod: "card"},
    {id: 22, date: "2024-12-22", amount: 5000.0, type: "income", category: "salary", description: "Annual bonus", paymentMethod: "bank transfer"},
    {id: 23, date: "2024-12-23", amount: -75.0, type: "expense", category: "dining", description: "Restaurant", paymentMethod: "cash"},
    {id: 24, date: "2024-12-24", amount: -50.0, type: "expense", category: "entertainment", description: "Movie night", paymentMethod: "card"},
    {id: 25, date: "2024-12-25", amount: -200.0, type: "expense", category: "rent", description: "Apartment rent", paymentMethod: "bank transfer"},
    {id: 26, date: "2024-12-26", amount: -90.0, type: "expense", category: "clothing", description: "New shoes", paymentMethod: "card"},
    {id: 27, date: "2024-12-27", amount: -150.0, type: "expense", category: "medical", description: "Doctor visit", paymentMethod: "cheque"},
    {id: 28, date: "2024-12-28", amount: -80.0, type: "expense", category: "utilities", description: "Electricity bill", paymentMethod: "bank transfer"},
    {id: 29, date: "2024-12-29", amount: -60.0, type: "expense", category: "subscriptions", description: "Streaming service", paymentMethod: "card"},
    {id: 30, date: "2024-12-30", amount: -100.0, type: "expense", category: "home", description: "Furniture purchase", paymentMethod: "cheque"},
    {id: 31, date: "2024-12-31", amount: -85.0, type: "expense", category: "gym", description: "Gym membership", paymentMethod: "card"},
    {id: 32, date: "2025-01-01", amount: 1200.0, type: "income", category: "salary", description: "Monthly salary", paymentMethod: "bank transfer"},
    {id: 33, date: "2025-01-02", amount: -75.0, type: "expense", category: "dining", description: "Restaurant", paymentMethod: "cash"},
    {id: 34, date: "2025-01-03", amount: -45.0, type: "expense", category: "entertainment", description: "Concert ticket", paymentMethod: "card"},
    {id: 35, date: "2025-01-04", amount: -200.0, type: "expense", category: "rent", description: "Apartment rent", paymentMethod: "bank transfer"},
    {id: 36, date: "2025-01-05", amount: -100.0, type: "expense", category: "electronics", description: "Tablet purchase", paymentMethod: "cheque"},
    {id: 37, date: "2025-01-06", amount: -30.0, type: "expense", category: "travel", description: "Taxi ride", paymentMethod: "cash"},
    {id: 38, date: "2025-01-07", amount: 700.0, type: "income", category: "freelance", description: "Client payment", paymentMethod: "bank transfer"},
    {id: 39, date: "2025-01-08", amount: -120.0, type: "expense", category: "clothing", description: "New jacket", paymentMethod: "card"},
    {id: 40, date: "2025-01-09", amount: -50.0, type: "expense", category: "subscriptions", description: "Gym membership", paymentMethod: "bank transfer"},
    {id: 41, date: "2025-01-10", amount: -80.0, type: "expense", category: "utilities", description: "Water bill", paymentMethod: "cheque"},
    {id: 42, date: "2025-01-11", amount: -60.0, type: "expense", category: "groceries", description: "Supermarket", paymentMethod: "card"},
    {id: 43, date: "2025-01-12", amount: 2500.0, type: "income", category: "bonus", description: "Year-end bonus", paymentMethod: "bank transfer"},
    {id: 44, date: "2025-01-13", amount: -110.0, type: "expense", category: "medical", description: "Pharmacy purchase", paymentMethod: "cash"},
    {id: 45, date: "2025-01-14", amount: -55.0, type: "expense", category: "entertainment", description: "Movie tickets", paymentMethod: "card"},
    {id: 46, date: "2025-01-15", amount: -180.0, type: "expense", category: "home", description: "Furniture purchase", paymentMethod: "cheque"},
    {id: 47, date: "2025-01-16", amount: -25.0, type: "expense", category: "transport", description: "Metro pass", paymentMethod: "cash"},
    {id: 48, date: "2025-01-17", amount: 800.0, type: "income", category: "freelance", description: "Consulting gig", paymentMethod: "bank transfer"},
    {id: 49, date: "2025-01-18", amount: -95.0, type: "expense", category: "dining", description: "Dinner with friends", paymentMethod: "card"},
    {id: 50, date: "2025-01-19", amount: -140.0, type: "expense", category: "electronics", description: "Smartwatch", paymentMethod: "cheque"},
    {id: 51, date: "2025-01-20", amount: -90.0, type: "expense", category: "gas", description: "Fuel refill", paymentMethod: "card"},
    {id: 52, date: "2025-01-21", amount: 3200.0, type: "income", category: "salary", description: "Monthly salary", paymentMethod: "bank transfer"}
]
console.log(transactions)

function AppDashboard() {
    const [filteredTransactions, setFilteredTransactions] = useState(transactions)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [minAmountFilter, setminAmountFilter] = useState("")
    const [maxAmountFilter, setmaxAmountFilter] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [filterSummary, setFilterSummary] = useState("")
    const [chatInput, setChatInput] = useState("")
    const [isLoading, setIsLoading] = useState(false) // Added loading state
    const canvasRef = useRef(null)

    useEffect(() => {
        applyFilters()
        console.log("applying filters...",{startDate, endDate, minAmountFilter, maxAmountFilter, typeFilter, categoryFilter})
    }, [startDate, endDate, minAmountFilter, maxAmountFilter, typeFilter, categoryFilter])

    useEffect(() => {
        drawPieChart()
    }, [filteredTransactions])

    const applyFilters = () => {
        const filtered = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date)
            const startDateObject = startDate ? new Date(startDate) : new Date(0)
            const endDateObject = endDate ? new Date(endDate) : new Date()
            console.log({minAmountFilter,maxAmountFilter})
            const properminAmountFilter = (minAmountFilter === undefined || minAmountFilter) === null ? "" : minAmountFilter
            const propermaxAmountFilter = (maxAmountFilter === undefined || maxAmountFilter === null )? "" : maxAmountFilter
            return (
                transactionDate >= startDateObject &&
                transactionDate <= endDateObject &&
                (properminAmountFilter === "" || Math.abs(transaction.amount) >= Number.parseFloat(properminAmountFilter)) &&
                (propermaxAmountFilter === "" || Math.abs(transaction.amount) <= Number.parseFloat(propermaxAmountFilter)) &&
                (typeFilter === "all" || transaction.type === typeFilter) &&
                (categoryFilter === "all" || transaction.category === categoryFilter)
            )
        })
        console.log({filtered})
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

    const handleChatSubmit = async (e) => {
        e.preventDefault()
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
                    prompt: chatInput,
                },
                {withCredentials: true},
            )
            console.log(res.data)
            if(Array.from(Object.keys(res.data.filterSettings)).length > 0){
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
                    <form onSubmit={handleChatSubmit} style={{display: "flex", marginBottom: "20px"}}>
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
                            <span>{filterSummary}<span>{filterSummary? <button onClick={resetFilters} style={{marginLeft:"1em"}}>Reset</button> : ""}</span></span>
                        </div>
                    </div>
                    <h2 style={{color: "#4a4a4a", marginBottom: "10px"}}>Filters</h2>
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
                                ["All Categories", ...Array.from(new Set(transactions.map(t=>t.category)))].map((item,i)=>(
                                    <option value={i===0? "all" : item} key={"option-key-"+item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
                                ))
                            }
                            {/*<option value="all">All Categories</option>*/}
                            {/*<option value="groceries">Groceries</option>*/}
                            {/*<option value="travel">Travel</option>*/}
                            {/*<option value="gas">Gas</option>*/}
                            {/*<option value="salary">Salary</option>*/}
                            {/*<option value="freelance">Freelance</option>*/}
                            {/*<option value="dining">Dining</option>*/}
                            {/*<option value="electronics">Electronics</option>*/}

                        </select>
                        <button
                            onClick={resetFilters}
                            style={{
                                padding: "5px 10px",
                                borderRadius: "3px",
                                border: "1px solid #ccc",
                                backgroundColor: "#f8f9fa",
                            }}
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
                        <h2 style={{color: "#4a4a4a", marginBottom: "10px"}}>Expense Breakdown</h2>
                        <canvas ref={canvasRef} width="400" height="300"
                                style={{margin: "0 auto", display: "block"}}></canvas>
                    </div>

                    <div
                        style={{
                            flex: 1,
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "5px",
                            maxHeight: "500px",
                            overflowY: "auto",
                        }}
                    >
                        <h2 style={{color: "#4a4a4a", marginBottom: "10px"}}>Transaction History</h2>
                        {filteredTransactions.map((transaction) => (
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
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AppDashboard

