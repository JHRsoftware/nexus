'use client';

import React, { useState, useEffect } from 'react';
import { usePageProtection } from '@/components/ProtectedRoute';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { handleNumberInputWheel } from '@/lib/numberInputUtils';
import styles from './softwareSettings.module.css';

interface SettingsData {
  // Company Information
  companyName: string;
  companyAddress: string;
  companyContactNumber: string;
  companyBusinessRegNo: string;
  companyDescription: string;
  companyLogo?: string;
  
  // Invoice Settings
  invoiceWatermark: string;
  invoiceTermsAndConditions: string;
  invoiceFooter: string;
  invoiceDeveloperNote: string;
  
  // Credit & Financial Settings
  defaultCreditLimit: number;
  totalBalanceDiscountPercent: number;
  showTotalBalanceDiscount: boolean;
  
  // Due Date Options
  dueDateOptions: {
    label: string;
    days: number;
    isDefault: boolean;
  }[];
  
  // Invoice Display Settings
  isSellingPriceReadonly: boolean;
  isDiscountReadonly: boolean;
  showTotalDiscountFromItems: boolean;
  hideCostProfit: boolean;
  
  // Orders Page Settings
  hideSellingPrice: boolean;
  hideDiscount: boolean;
  hideFreeProducts: boolean;
  hideCashDiscount: boolean;
}

const SettingsManagement: React.FC = () => {
  // Page protection
  const { isAuthorized, isLoading: authLoading } = usePageProtection('softwareSettings');
  
  // Theme and Auth context
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  
  // Form state
  const [settings, setSettings] = useState<SettingsData>({
    companyName: '',
    companyAddress: '',
    companyContactNumber: '',
    companyBusinessRegNo: '',
    companyDescription: '',
    companyLogo: '',
    invoiceWatermark: '',
    invoiceTermsAndConditions: '',
    invoiceFooter: '',
    invoiceDeveloperNote: '',
    defaultCreditLimit: 100000,
    totalBalanceDiscountPercent: 5,
    showTotalBalanceDiscount: false,
    dueDateOptions: [
      { label: '1 Month', days: 30, isDefault: false },
      { label: '45 Days', days: 45, isDefault: false },
      { label: '2 Months', days: 60, isDefault: false },
      { label: '75 Days', days: 75, isDefault: false },
      { label: '3 Months', days: 90, isDefault: true },
    ],
    isSellingPriceReadonly: false,
    isDiscountReadonly: false,
    showTotalDiscountFromItems: true,
    hideCostProfit: false,
    hideSellingPrice: false,
    hideDiscount: false,
    hideFreeProducts: false,
    hideCashDiscount: false
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('company');

  // Get user headers for API requests
  const getUserHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'x-user-data': JSON.stringify(user || {})
    };
  };

  // Load settings data
  useEffect(() => {
    if (isAuthorized) {
      loadSettings();
    }
  }, [isAuthorized]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/softwareSettings', {
        headers: getUserHeaders()
      });
      const data = await response.json();
      
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error loading softwareSettings:', error);
      setError('Failed to load softwareSettings');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof SettingsData, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle due date option changes
  const handleDueDateOptionChange = (index: number, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      dueDateOptions: prev.dueDateOptions.map((option, i) => {
        if (i === index) {
          return { ...option, [field]: value };
        }
        // If setting as default, unset others
        if (field === 'isDefault' && value === true) {
          return { ...option, isDefault: false };
        }
        return option;
      })
    }));
  };

  // Add new due date option
  const addDueDateOption = () => {
    setSettings(prev => ({
      ...prev,
      dueDateOptions: [
        ...prev.dueDateOptions,
        { label: '', days: 30, isDefault: false }
      ]
    }));
  };

  // Remove due date option
  const removeDueDateOption = (index: number) => {
    setSettings(prev => ({
      ...prev,
      dueDateOptions: prev.dueDateOptions.filter((_, i) => i !== index)
    }));
  };



  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/softwareSettings', {
        method: 'POST',
        headers: getUserHeaders(),
        body: JSON.stringify(settings)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
        
        // Trigger company name update in sidebar
        window.dispatchEvent(new Event('companyNameUpdated'));
      } else {
        setError(data.error || 'Failed to save software Settings');
      }
    } catch (error) {
      console.error('Error saving software Settings:', error);
      setError('An error occurred while saving software Settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading while checking authorization
  if (authLoading) {
    return <div className={styles.loading}>Checking permissions...</div>;
  }

  // Show access denied if not authorized
  if (!isAuthorized) {
    return <div className={styles.accessDenied}>Access denied to software settings</div>;
  }

  return (
    <div className={`${styles.container} ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Software Settings</h1>
        <p className={styles.subtitle}>Configure your business information and invoice settings</p>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabContainer}>
        <div className={styles.tabButtons}>
          <button
            className={`${styles.tabButton} ${activeTab === 'company' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('company')}
          >
            🏢 Company Info
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'invoice' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('invoice')}
          >
            📋 Invoice Settings
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'financial' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('financial')}
          >
            💰 Financial Settings
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'dates' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('dates')}
          >
            📅 Due Date Options
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'display' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('display')}
          >
            ⚙️ Invoice Display
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'orders' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Orders Page
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Company Information Tab */}
        {activeTab === 'company' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Company Information</h2>
            
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Company/Shop Name *</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className={styles.input}
                  placeholder="Enter your company or shop name"
                  disabled={isSaving}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Contact Number *</label>
                <input
                  type="tel"
                  value={settings.companyContactNumber}
                  onChange={(e) => handleInputChange('companyContactNumber', e.target.value)}
                  className={styles.input}
                  placeholder="Enter contact number"
                  disabled={isSaving}
                  required
                />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Company Address *</label>
                <textarea
                  value={settings.companyAddress}
                  onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                  className={styles.textarea}
                  placeholder="Enter complete business address"
                  disabled={isSaving}
                  rows={3}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Business Registration No</label>
                <input
                  type="text"
                  value={settings.companyBusinessRegNo}
                  onChange={(e) => handleInputChange('companyBusinessRegNo', e.target.value)}
                  className={styles.input}
                  placeholder="Enter business registration number"
                  disabled={isSaving}
                />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Company Description</label>
                <textarea
                  value={settings.companyDescription}
                  onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                  className={styles.textarea}
                  placeholder="Brief description of your business"
                  disabled={isSaving}
                  rows={3}
                />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Company Logo URL</label>
                <input
                  type="url"
                  value={settings.companyLogo}
                  onChange={(e) => handleInputChange('companyLogo', e.target.value)}
                  className={styles.input}
                  placeholder="https://example.com/your-logo.png"
                  disabled={isSaving}
                />
                <small className={styles.fieldHint}>
                  Enter a direct URL to your company logo image. Make sure the URL is publicly accessible and ends with .jpg, .png, or .gif
                </small>
                {settings.companyLogo && (
                  <div className={styles.logoPreview}>
                    <img src={settings.companyLogo} alt="Company Logo" className={styles.logoImage} />
                    <button
                      type="button"
                      onClick={() => handleInputChange('companyLogo', '')}
                      className={styles.removeLogoButton}
                    >
                      Remove Logo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Invoice Settings Tab */}
        {activeTab === 'invoice' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Invoice Configuration</h2>
            
            <div className={styles.formGrid}>
              <div className={styles.fieldFull}>
                <label className={styles.label}>Invoice Watermark</label>
                <input
                  type="text"
                  value={settings.invoiceWatermark}
                  onChange={(e) => handleInputChange('invoiceWatermark', e.target.value)}
                  className={styles.input}
                  placeholder="e.g., PAID, CONFIDENTIAL"
                  disabled={isSaving}
                />
                <small className={styles.fieldHint}>Text that appears as watermark on invoices</small>
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Terms and Conditions</label>
                <textarea
                  value={settings.invoiceTermsAndConditions}
                  onChange={(e) => handleInputChange('invoiceTermsAndConditions', e.target.value)}
                  className={styles.textarea}
                  placeholder="Enter your invoice terms and conditions"
                  disabled={isSaving}
                  rows={4}
                />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Invoice Footer</label>
                <textarea
                  value={settings.invoiceFooter}
                  onChange={(e) => handleInputChange('invoiceFooter', e.target.value)}
                  className={styles.textarea}
                  placeholder="Footer text for invoices (e.g., Thank you for your business!)"
                  disabled={isSaving}
                  rows={2}
                />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Developer Note</label>
                <input
                  type="text"
                  value={settings.invoiceDeveloperNote}
                  onChange={(e) => handleInputChange('invoiceDeveloperNote', e.target.value)}
                  className={styles.input}
                  placeholder="Developer/Software information"
                  disabled={isSaving}
                />
                <small className={styles.fieldHint}>Credit line for software developer (optional)</small>
              </div>
            </div>
          </div>
        )}

        {/* Financial Settings Tab */}
        {activeTab === 'financial' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Financial Configuration</h2>
            
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Default Credit Limit (LKR) *</label>
                <input
                  type="number"
                  value={settings.defaultCreditLimit}
                  onChange={(e) => handleInputChange('defaultCreditLimit', parseFloat(e.target.value) || 0)}
                  onWheel={handleNumberInputWheel}
                  className={styles.input}
                  placeholder="100000"
                  disabled={isSaving}
                  min="0"
                  step="1000"
                  required
                />
                <small className={styles.fieldHint}>Default credit limit for new customers</small>
              </div>


            </div>
          </div>
        )}

        {/* Due Date Options Tab */}
        {activeTab === 'dates' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Due Date Options</h2>
            <p className={styles.sectionDescription}>Configure available payment terms for credit invoices</p>
            
            <div className={styles.dueDateOptions}>
              {settings.dueDateOptions.map((option, index) => (
                <div key={index} className={styles.dueDateOption}>
                  <div className={styles.dueDateFields}>
                    <div className={styles.field}>
                      <label className={styles.label}>Label</label>
                      <input
                        type="text"
                        value={option.label}
                        onChange={(e) => handleDueDateOptionChange(index, 'label', e.target.value)}
                        className={styles.input}
                        placeholder="e.g., 1 Month"
                        disabled={isSaving}
                      />
                    </div>
                    
                    <div className={styles.field}>
                      <label className={styles.label}>Days</label>
                      <input
                        type="number"
                        value={option.days}
                        onChange={(e) => handleDueDateOptionChange(index, 'days', parseInt(e.target.value) || 0)}
                        onWheel={handleNumberInputWheel}
                        className={styles.input}
                        placeholder="30"
                        disabled={isSaving}
                        min="1"
                      />
                    </div>
                    
                    <div className={styles.field}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={option.isDefault}
                          onChange={(e) => handleDueDateOptionChange(index, 'isDefault', e.target.checked)}
                          className={styles.checkbox}
                          disabled={isSaving}
                        />
                        <span>Default</span>
                      </label>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeDueDateOption(index)}
                    className={styles.removeOptionButton}
                    disabled={isSaving || settings.dueDateOptions.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addDueDateOption}
                className={styles.addOptionButton}
                disabled={isSaving}
              >
                + Add Due Date Option
              </button>
            </div>
          </div>
        )}

        {/* Invoice Display Settings Tab */}
        {activeTab === 'display' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📋 Invoice Display Configuration</h3>
            <div className={styles.sectionDescription}>
              Configure how invoice form fields behave during invoice creation
            </div>

            <div className={styles.formGrid}>
              {/* Selling Price Readonly */}
              <div className={styles.fieldGroup}>
                <div className={styles.toggleField}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.isSellingPriceReadonly}
                      onChange={(e) => handleInputChange('isSellingPriceReadonly', e.target.checked)}
                      className={styles.toggleInput}
                      disabled={isSaving}
                    />
                    <span className={styles.toggleSlider}></span>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>Make Selling Price Read-Only</span>
                      <span className={styles.toggleDescription}>
                        When enabled, selling price fields will be read-only in invoice creation
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Discount Readonly */}
              <div className={styles.fieldGroup}>
                <div className={styles.toggleField}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.isDiscountReadonly}
                      onChange={(e) => handleInputChange('isDiscountReadonly', e.target.checked)}
                      className={styles.toggleInput}
                      disabled={isSaving}
                    />
                    <span className={styles.toggleSlider}></span>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>Make Discount Read-Only</span>
                      <span className={styles.toggleDescription}>
                        When enabled, discount fields will be read-only in invoice creation
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Show Total Discount from Items */}
              <div className={styles.fieldGroup}>
                <div className={styles.toggleField}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.showTotalDiscountFromItems}
                      onChange={(e) => handleInputChange('showTotalDiscountFromItems', e.target.checked)}
                      className={styles.toggleInput}
                      disabled={isSaving}
                    />
                    <span className={styles.toggleSlider}></span>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>Show Discount Features</span>
                      <span className={styles.toggleDescription}>
                        When enabled, shows the Discount column in invoice items table and "Total Discount from Items" row in totals section
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Hide Cost & Profit */}
              <div className={styles.fieldGroup}>
                <div className={styles.toggleField}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.hideCostProfit}
                      onChange={(e) => handleInputChange('hideCostProfit', e.target.checked)}
                      className={styles.toggleInput}
                      disabled={isSaving}
                    />
                    <span className={styles.toggleSlider}></span>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>Hide Cost & Profit Information</span>
                      <span className={styles.toggleDescription}>
                        When enabled, cost and profit columns/sections will be hidden in invoice pages
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Cash Discount Settings */}
              <div className={styles.fieldGroup}>
                {/* Cash Discount Percentage */}
                <div className={styles.field}>
                  <label className={styles.label}>Cash Discount Percentage (%)</label>
                  <input
                    type="number"
                    value={settings.totalBalanceDiscountPercent}
                    onChange={(e) => handleInputChange('totalBalanceDiscountPercent', parseFloat(e.target.value) || 0)}
                    onWheel={handleNumberInputWheel}
                    className={styles.input}
                    placeholder="5"
                    disabled={isSaving}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <small className={styles.fieldHint}>Cash discount percentage used in invoices (dynamically applied)</small>
                </div>

                {/* Hide Cash Discount Option */}
                <div className={styles.toggleField}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.showTotalBalanceDiscount}
                      onChange={(e) => handleInputChange('showTotalBalanceDiscount', e.target.checked)}
                      className={styles.toggleInput}
                      disabled={isSaving}
                    />
                    <span className={styles.toggleSlider}></span>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>Hide Cash Discount Option</span>
                      <span className={styles.toggleDescription}>
                        When enabled, the Cash Discount option will be hidden from invoice creation
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Page Settings Tab */}
        {activeTab === 'orders' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📦 Orders Page Configuration</h3>
            <div className={styles.sectionDescription}>
              Control visibility and behavior of elements in the Orders page
            </div>

            <div className={styles.formGrid}>
              {/* Selling Price Column Control */}
              <div className={styles.fieldGroup}>
                <div className={styles.toggleField}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.hideSellingPrice}
                      onChange={(e) => handleInputChange('hideSellingPrice', e.target.checked)}
                      className={styles.toggleInput}
                      disabled={isSaving}
                    />
                    <span className={styles.toggleSlider}></span>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>Make Selling Price Column Read-Only</span>
                      <span className={styles.toggleDescription}>
                        When enabled, the Selling Price column in orders will be read-only and cannot be edited
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Discount Column Control */}
              <div className={styles.fieldGroup}>
                <div className={styles.toggleField}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.hideDiscount}
                      onChange={(e) => handleInputChange('hideDiscount', e.target.checked)}
                      className={styles.toggleInput}
                      disabled={isSaving}
                    />
                    <span className={styles.toggleSlider}></span>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>Make Discount Column Read-Only</span>
                      <span className={styles.toggleDescription}>
                        When enabled, the Discount column in orders will be read-only and cannot be edited
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Free Products Control */}
              <div className={styles.fieldGroup}>
                <div className={styles.toggleField}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.hideFreeProducts}
                      onChange={(e) => handleInputChange('hideFreeProducts', e.target.checked)}
                      className={styles.toggleInput}
                      disabled={isSaving}
                    />
                    <span className={styles.toggleSlider}></span>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>Hide Add Free Products Feature</span>
                      <span className={styles.toggleDescription}>
                        When enabled, the "Add Free Products" feature will be hidden from the orders page
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Cash Discount Control */}
              <div className={styles.fieldGroup}>
                <div className={styles.toggleField}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={settings.hideCashDiscount}
                      onChange={(e) => handleInputChange('hideCashDiscount', e.target.checked)}
                      className={styles.toggleInput}
                      disabled={isSaving}
                    />
                    <span className={styles.toggleSlider}></span>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>Hide Enable Cash Discount (%) Feature</span>
                      <span className={styles.toggleDescription}>
                        When enabled, the "Enable Cash Discount (%)" option will be hidden from the orders page
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      {error && <div className={styles.error}>{error}</div>}
      {message && <div className={styles.success}>{message}</div>}
      {isLoading && <div className={styles.loading}>Loading settings...</div>}

      {/* Save Button */}
      <div className={styles.saveSection}>
        <button
          onClick={handleSave}
          className={styles.saveButton}
          disabled={isSaving || isLoading}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default SettingsManagement;