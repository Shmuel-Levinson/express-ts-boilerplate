import React, { useState } from 'react';

interface ProfileProps {
    currentTheme: any;
}

function Profile({ currentTheme }: ProfileProps) {
    const [userData, setUserData] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main Street',
        preferences: {
            emailNotifications: true,
            newsletterSubscription: false,
            darkMode: true
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setUserData(prev => ({
            ...prev,
            ...(type === 'checkbox' 
                ? { preferences: { ...prev.preferences, [name]: checked } }
                : { [name]: value })
        }));
    };

    return (
        <div style={{
            backgroundColor: currentTheme.surface,
            padding: "2rem",
            borderRadius: "12px",
            maxWidth: "600px",
            margin: "0 auto",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                marginBottom: "2rem"
            }}>
                <div style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    backgroundColor: currentTheme.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                }}>
                    <span style={{ fontSize: "2.5rem", color: currentTheme.surface }}>
                        {userData.name.charAt(0)}
                    </span>
                </div>
                <h2 style={{ margin: 0 }}>User Profile</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "6px",
                            border: `1px solid ${currentTheme.border}`,
                            backgroundColor: currentTheme.background,
                            color: currentTheme.text
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "6px",
                            border: `1px solid ${currentTheme.border}`,
                            backgroundColor: currentTheme.background,
                            color: currentTheme.text
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "6px",
                            border: `1px solid ${currentTheme.border}`,
                            backgroundColor: currentTheme.background,
                            color: currentTheme.text
                        }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <label style={{ fontWeight: "bold" }}>Preferences</label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={userData.preferences.emailNotifications}
                            onChange={handleInputChange}
                        />
                        Email Notifications
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input
                            type="checkbox"
                            name="newsletterSubscription"
                            checked={userData.preferences.newsletterSubscription}
                            onChange={handleInputChange}
                        />
                        Newsletter Subscription
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input
                            type="checkbox"
                            name="darkMode"
                            checked={userData.preferences.darkMode}
                            onChange={handleInputChange}
                        />
                        Dark Mode
                    </label>
                </div>
            </div>
        </div>
    );
}

export default Profile; 