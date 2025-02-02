import React from 'react';

interface Account {
    id: string;
    name: string;
    email: string;
    accountNumber: string;
    balance: number;
    type: string;
    avatarUrl: string;
}

interface AccountsProps {
    currentTheme: any;
}

function Accounts({ currentTheme }: AccountsProps) {
    const mockAccounts: Account[] = [
        {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            accountNumber: '**** **** **** 4521',
            balance: 5249.82,
            type: 'Checking Account',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        },
        {
            id: '2',
            name: 'Michael Chen',
            email: 'michael.c@example.com',
            accountNumber: '**** **** **** 7845',
            balance: 12750.33,
            type: 'Savings Account',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
        },
        {
            id: '3',
            name: 'Emma Rodriguez',
            email: 'emma.r@example.com',
            accountNumber: '**** **** **** 9632',
            balance: 3867.15,
            type: 'Investment Account',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
        }
    ];

    return (
        <div style={{
            backgroundColor: currentTheme.surface,
            padding: "20px",
            borderRadius: "5px",
        }}>
            <h2 style={{ marginBottom: '24px' }}>Your Accounts</h2>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px' 
            }}>
                {mockAccounts.map(account => (
                    <div key={account.id} style={{
                        backgroundColor: currentTheme.background,
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.2s ease',
                        cursor: 'pointer',
                        ':hover': {
                            transform: 'translateY(-5px)'
                        }
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '16px' 
                        }}>
                            <img 
                                src={account.avatarUrl} 
                                alt={`${account.name}'s avatar`}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    marginRight: '16px'
                                }}
                            />
                            <div>
                                <h3 style={{ margin: '0 0 4px 0' }}>{account.name}</h3>
                                <p style={{ 
                                    margin: '0',
                                    color: currentTheme.textSecondary,
                                    fontSize: '0.9rem'
                                }}>{account.email}</p>
                            </div>
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ 
                                margin: '0 0 4px 0',
                                color: currentTheme.textSecondary,
                                fontSize: '0.9rem'
                            }}>{account.type}</p>
                            <p style={{ 
                                margin: '0',
                                fontSize: '0.9rem'
                            }}>{account.accountNumber}</p>
                        </div>
                        
                        <div style={{
                            borderTop: `1px solid ${currentTheme.border}`,
                            paddingTop: '16px'
                        }}>
                            <p style={{ 
                                margin: '0',
                                fontSize: '1.25rem',
                                fontWeight: 'bold'
                            }}>
                                ${account.balance.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Accounts; 