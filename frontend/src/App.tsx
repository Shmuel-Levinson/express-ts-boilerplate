import React, {useState, useEffect, useRef} from "react"
import axios from "axios"
import {SuggestionButton} from "./components/suggestion-button.tsx"
import "./App.css"
import {TRANSACTIONS} from "./mock-data.ts"
import {getRandomSample, shuffleArray} from "./utils/array-utils.ts"
import {isEmpty} from "./utils/object-utils.ts";

const initialFilterState = {
    startDateFilter: "",
    endDateFilter: "",
    minAmountFilter: "",
    maxAmountFilter: "",
    typeFilter: "all",
    categoryFilter: "all",
    paymentMethodFilter: "all",
}

const allSuggestions = [
    "Uh, could you show me what I spent on gas?",
    "Hey, can I see my travel expenses for this month, please?",
    "Do you have a record of my salary history?",
    "I'm trying to remember when I spent more than $1550 on groceries.",
    "Can you pull up my entertainment expenses?",
    "I'd like to see transactions between 500 and 1000 dollars.",
    "What did I pay for utilities last month?",
    "Can you show me income over two thousand dollars?",
    "What about my restaurant spending?",
    "Can I see everything from last week?",
    "Show me all the money I made in January.",
    "What were my expenses for the whole of 2023?",
    "Could you show me everything over a thousand dollars from last month?",
    "Anything under 50 bucks from last week?",
    "I'm looking for expenses between one and five hundred dollars.",
    "Show me all income from the first half of January.",
    "Can I see all my rent payments from last year?",
    "Show me everything I spent on food between 50 and 100 dollars.",
    "I need to see my shopping expenses from last week that were over 200 dollars.",
    "Can you pull up my salary income between two and five thousand dollars from last month?",
    "Show me all my travel spending from June first to July first that was less than a thousand dollars.",
    "I'm looking for expenses from last year between 500 and 1000 dollars for bills.",
    "Show me all transactions made with my credit card.",
    "Can you display all cash payments from last month?",
    "I want to see all bank transfers over $1000.",
    "What cheques did I write last quarter?",
]

// Function to generate a random color
const generateColor = (index) => {
    const hue = (index * 137.5) % 360 // Use golden angle approximation for distribution
    return `hsl(${hue}, 80%, 70%)` // Keeping saturation and lightness constant for consistency
}

function AppDashboard() {
    const [filteredTransactions, setFilteredTransactions] = useState(TRANSACTIONS)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [minAmountFilter, setminAmountFilter] = useState("")
    const [maxAmountFilter, setmaxAmountFilter] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
    const [filterSummary, setFilterSummary] = useState("")
    const [chatInput, setChatInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [allShuffledSuggestions, setAllShuffledSuggestions] = useState(shuffleArray([...allSuggestions]))
    const [visibleSuggestions, setVisibleSuggestions] = useState(allShuffledSuggestions.slice(0, 2))
    const canvasRef = useRef(null)

    useEffect(() => {
        applyFilters()
    }, [startDate, endDate, minAmountFilter, maxAmountFilter, typeFilter, categoryFilter, paymentMethodFilter])

    useEffect(() => {
        drawPieChart()
    }, [filteredTransactions])

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
        setFilterSummary("")
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
                        paymentMethodFilter: paymentMethodFilter,
                    },
                    prompt: prompt ? prompt : chatInput,
                },
                {withCredentials: true},
            )
            console.log(res.data)
            if(isEmpty(res.data?.filterSettings)){
                resetFilters()
            }
            if (Array.from(Object.keys(res.data.filterSettings)).length > 0) {
                console.log("setting filter with ", res.data.filterSettings)
                setFilters(res.data.filterSettings)
            }
            setFilterSummary(res.data.response)
            setChatInput("")
        } catch (error) {
            console.error("Error updating filters:", error)
        } finally {
            setIsLoading(false)
            shuffleAndUpdateSuggestions()
            console.log("done")
        }
    }

    const shuffleAndUpdateSuggestions = () => {
        const shuffled = shuffleArray([...allSuggestions])
        setAllShuffledSuggestions(shuffled)
        setVisibleSuggestions(shuffled.slice(0, 2))
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
                            {'➤'}
                        </button>
                    </form>
                    <div style={{width: "100%", textAlign: "center", color: "#444"}}>Try these suggestions</div>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            // alignItems: "center",
                            gap: "3px",
                            marginBottom: "10px",
                        }}
                    >
                        {visibleSuggestions.map((suggestion: string, index) => {
                            return <SuggestionButton key={index} suggestion={suggestion}
                                                     clickHandler={handleChatSubmit}/>
                        })}
                    </div>
                    {visibleSuggestions.length < allSuggestions.length && (
                        <div style={{display: "flex", justifyContent: "center", marginBottom: "20px"}}>
                            <button
                                onClick={handleMoreSuggestions}
                                style={{
                                    padding: "5px 10px",
                                    fontSize: "14px",
                                    backgroundColor: "#f0f0f0",
                                    color: "#333",
                                    border: "1px solid #ccc",
                                    borderRadius: "3px",
                                    cursor: "pointer",
                                }}
                            >
                                More suggestions
                            </button>
                        </div>
                    )}
                    <div style={{height: 50}}>
                        <div style={{display: isLoading ? "flex" : "none", justifyContent:"center", alignItems: "center", marginBottom: "10px"}}>
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
                        <div style={{display: isLoading ? "none" : "flex", alignItems: "center", justifyContent:"center",marginBottom: "10px", width:"100%"}}>
              <span>
                {filterSummary}
                  <span>
                  {filterSummary ? (
                      <button onClick={resetFilters} className="reset-button" style={{marginLeft: "1em"}}>
                          Reset
                      </button>
                  ) : (
                      ""
                  )}
                </span>
              </span>
                        </div>
                    </div>
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
                        <canvas ref={canvasRef} width="500" height="500"
                                style={{margin: "0 auto", display: "block"}}></canvas>
                    </div>

                    <div
                        className="scrollable-section"
                        style={{
                            flex: 1,
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "5px",
                            maxHeight: "500px",
                        }}
                    >
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
                                    <span>{transaction.paymentMethod}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AppDashboard

