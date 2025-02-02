import React from 'react';
import { Settings as SettingsType } from '../App';

interface SettingsProps {
    settings: SettingsType;
    onSettingChange: <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => void;
    currentTheme: any;
}

function Settings({ settings, onSettingChange, currentTheme }: SettingsProps) {
    const handleNestedChange = (
        category: 'notifications' | 'security' | 'display',
        key: string,
        value: boolean
    ) => {
        onSettingChange(category, {
            ...settings[category],
            [key]: value
        });
    };

    return (
        <div style={{
            backgroundColor: currentTheme.surface,
            padding: "20px",
            borderRadius: "5px",
        }}>
            <h2>Settings</h2>
            
            {/* Density Section */}
            <section style={{ marginBottom: "24px" }}>
                <h3>Display Density</h3>
                <select 
                    value={settings.density}
                    onChange={(e) => onSettingChange('density', e.target.value as SettingsType['density'])}
                    style={{
                        backgroundColor: currentTheme.surface2,
                        color: currentTheme.text,
                        border: `1px solid ${currentTheme.border}`,
                        padding: "5px",
                        borderRadius: "3px"
                    }}
                >
                    <option value="comfortable">Comfortable</option>
                    <option value="cozy">Cozy</option>
                    <option value="compact">Compact</option>
                </select>
            </section>

            {/* Notifications Section */}
            <section style={{ marginBottom: "24px" }}>
                <h3>Notifications</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={settings.notifications.email}
                            onChange={(e) => handleNestedChange('notifications', 'email', e.target.checked)}
                        />
                        Email Notifications
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={settings.notifications.push}
                            onChange={(e) => handleNestedChange('notifications', 'push', e.target.checked)}
                        />
                        Push Notifications
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={settings.notifications.desktop}
                            onChange={(e) => handleNestedChange('notifications', 'desktop', e.target.checked)}
                        />
                        Desktop Notifications
                    </label>
                </div>
            </section>

            {/* Security Section */}
            <section style={{ marginBottom: "24px" }}>
                <h3>Security</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) => handleNestedChange('security', 'twoFactorAuth', e.target.checked)}
                        />
                        Two-Factor Authentication
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={settings.security.loginAlerts}
                            onChange={(e) => handleNestedChange('security', 'loginAlerts', e.target.checked)}
                        />
                        Login Alerts
                    </label>
                </div>
            </section>

            {/* Display Section */}
            <section style={{ marginBottom: "24px" }}>
                <h3>Display Options</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={settings.display.showToolbar}
                            onChange={(e) => handleNestedChange('display', 'showToolbar', e.target.checked)}
                        />
                        Show Toolbar
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={settings.display.enableAnimations}
                            onChange={(e) => handleNestedChange('display', 'enableAnimations', e.target.checked)}
                        />
                        Enable Animations
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={settings.display.showStatusBar}
                            onChange={(e) => handleNestedChange('display', 'showStatusBar', e.target.checked)}
                        />
                        Show Status Bar
                    </label>
                </div>
            </section>
        </div>
    );
}

export default Settings;