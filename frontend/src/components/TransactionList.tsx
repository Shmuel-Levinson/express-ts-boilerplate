interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number;
    type: string;
    category: string;
    paymentMethod: string;
}

interface TransactionListProps {
    transactions: Transaction[];
    currentTheme: any;
}

function TransactionList({ transactions, currentTheme }: TransactionListProps) {
    return (
        <div style={{
            backgroundColor: currentTheme.surface,
            // padding: "20px",
            borderRadius: "5px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
        }}>
            {/* Transaction Count */}
            <div style={{ 
                marginBottom: "10px",
                color: currentTheme.text,
                fontSize: "0.9em",
                textAlign: "right",
                flexShrink: 0, // Prevent shrinking
            }}>
                Showing {transactions.length} transactions
            </div>

            {/* Fixed Header */}
            <div style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                borderBottom: `2px solid ${currentTheme.border}`,
                backgroundColor: currentTheme.surface,
                padding: "10px 0",
                flexShrink: 0, // Prevent shrinking
            }}>
                <div style={{ textAlign: "center", fontWeight: "bold" }}>Date</div>
                <div style={{ textAlign: "center", fontWeight: "bold" }}>Description</div>
                <div style={{ textAlign: "center", fontWeight: "bold" }}>Amount</div>
                <div style={{ textAlign: "center", fontWeight: "bold" }}>Type</div>
                <div style={{ textAlign: "center", fontWeight: "bold" }}>Category</div>
                <div style={{ textAlign: "center", fontWeight: "bold" }}>Payment Method</div>
            </div>

            {/* Scrollable Table Body */}
            <div style={{ 
                overflowY: "auto",
                flex: 1,
                minHeight: 0, // Important for Firefox
            }}>
                <table style={{ 
                    width: "100%", 
                    borderCollapse: "collapse",
                }}>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr 
                                key={transaction.id}
                                style={{ borderBottom: `1px solid ${currentTheme.border}` }}
                            >
                                <td style={{ padding: "10px", textAlign: "center", width: "16.66%" }}>{transaction.date}</td>
                                <td style={{ padding: "10px", textAlign: "center", width: "16.66%" }}>{transaction.description}</td>
                                <td style={{ 
                                    padding: "10px", 
                                    textAlign: "center",
                                    width: "16.66%",
                                    color: transaction.type.toLowerCase() === 'income' ? '#2ecc71' : '#e74c3c'
                                }}>
                                    ${Math.abs(transaction.amount).toFixed(2)}
                                </td>
                                <td style={{ padding: "10px", textAlign: "center", width: "16.66%" }}>{transaction.type}</td>
                                <td style={{ padding: "10px", textAlign: "center", width: "16.66%" }}>{transaction.category}</td>
                                <td style={{ padding: "10px", textAlign: "center", width: "16.66%" }}>{transaction.paymentMethod}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TransactionList; 