import React from 'react';

interface NotificationsProps {
    currentTheme: any;
}

function Notifications({ currentTheme }: NotificationsProps) {
    return (
        <div style={{
            backgroundColor: currentTheme.surface,
            padding: "20px",
            borderRadius: "5px",
        }}>
            <h2>Notifications</h2>
            <p>Stay updated with your latest financial alerts and notifications.</p>
        </div>
    );
}

export default Notifications; 