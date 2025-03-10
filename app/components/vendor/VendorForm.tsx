import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { DatePicker } from '../DatePicker';
import { FileUpload } from '../FileUpload';
import { vendorService } from '../../../lib/services/VendorService';
import {
  Vendor,
  CreateVendorData,
  VendorContact,
  ServiceRate,
  VendorSpecialty,
  VendorStatus,
} from '../../../types/vendor';
import { Ionicons } from '@expo/vector-icons';

interface VendorFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: Vendor;
}

export function VendorForm({ onSubmit, onCancel, initialData }: VendorFormProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Basic Information
  const [companyName, setCompanyName] = useState(initialData?.companyName || '');
  const [businessType, setBusinessType] = useState(initialData?.businessType || 'company');
  const [taxId, setTaxId] = useState(initialData?.taxId || '');
  const [registrationNumber, setRegistrationNumber] = useState(initialData?.registrationNumber || '');
  const [status, setStatus] = useState<VendorStatus>(initialData?.status || 'pending');
  const [specialties, setSpecialties] = useState<VendorSpecialty[]>(initialData?.specialties || []);
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Address
  const [street, setStreet] = useState(initialData?.address.street || '');
  const [city, setCity] = useState(initialData?.address.city || '');
  const [state, setState] = useState(initialData?.address.state || '');
  const [postalCode, setPostalCode] = useState(initialData?.address.postalCode || '');
  const [country, setCountry] = useState(initialData?.address.country || '');

  // Contacts
  const [contacts, setContacts] = useState<VendorContact[]>(
    initialData?.contacts || [{ name: '', email: '', phone: '', role: '' }]
  );

  // Service Rates
  const [serviceRates, setServiceRates] = useState<ServiceRate[]>(
    initialData?.serviceRates || []
  );

  // Insurance Information
  const [insuranceProvider, setInsuranceProvider] = useState(initialData?.insuranceInfo?.provider || '');
  const [policyNumber, setPolicyNumber] = useState(initialData?.insuranceInfo?.policyNumber || '');
  const [insuranceExpiry, setInsuranceExpiry] = useState(initialData?.insuranceInfo?.expiryDate || '');
  const [coverageAmount, setCoverageAmount] = useState(
    initialData?.insuranceInfo?.coverageAmount?.toString() || ''
  );

  // Bank Information
  const [bankName, setBankName] = useState(initialData?.bankInfo?.bankName || '');
  const [accountName, setAccountName] = useState(initialData?.bankInfo?.accountName || '');
  const [accountNumber, setAccountNumber] = useState(initialData?.bankInfo?.accountNumber || '');
  const [routingNumber, setRoutingNumber] = useState(initialData?.bankInfo?.routingNumber || '');

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', email: '', phone: '', role: '' }]);
  };

  const handleUpdateContact = (index: number, field: keyof VendorContact, value: string) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setContacts(updatedContacts);
  };

  const handleRemoveContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleAddServiceRate = () => {
    setServiceRates([
      ...serviceRates,
      { specialty: 'general', rate: 0, rateType: 'hourly', currency: 'GHS' },
    ]);
  };

  const handleUpdateServiceRate = (
    index: number,
    field: keyof ServiceRate,
    value: string | number
  ) => {
    const updatedRates = [...serviceRates];
    updatedRates[index] = {
      ...updatedRates[index],
      [field]: field === 'rate' ? parseFloat(value as string) || 0 : value,
    };
    setServiceRates(updatedRates);
  };

  const handleRemoveServiceRate = (index: number) => {
    setServiceRates(serviceRates.filter((_, i) => i !== index));
  };

  const handleSpecialtyToggle = (specialty: VendorSpecialty) => {
    if (specialties.includes(specialty)) {
      setSpecialties(specialties.filter((s) => s !== specialty));
    } else {
      setSpecialties([...specialties, specialty]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!companyName) {
        throw new Error('Company name is required');
      }

      if (contacts.length === 0) {
        throw new Error('At least one contact is required');
      }

      if (specialties.length === 0) {
        throw new Error('At least one specialty is required');
      }

      const vendorData: CreateVendorData = {
        companyName,
        businessType: businessType as 'individual' | 'company',
        taxId: taxId || undefined,
        registrationNumber: registrationNumber || undefined,
        status,
        specialties,
        contacts,
        address: {
          street,
          city,
          state,
          postalCode,
          country,
        },
        serviceRates,
        insuranceInfo: insuranceProvider
          ? {
              provider: insuranceProvider,
              policyNumber,
              expiryDate: insuranceExpiry,
              coverageAmount: parseFloat(coverageAmount) || 0,
            }
          : undefined,
        bankInfo: bankName
          ? {
              bankName,
              accountName,
              accountNumber,
              routingNumber,
            }
          : undefined,
        notes: notes || undefined,
      };

      if (initialData?.id) {
        await vendorService.updateVendor(initialData.id, vendorData);
      } else {
        await vendorService.createVendor(vendorData);
      }

      onSubmit();
    } catch (err: any) {
      setError(err.message || 'Failed to save vendor');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    column: {
      flex: 1,
    },
    specialtiesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    specialtyButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.text.secondary,
    },
    specialtyButtonSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    specialtyText: {
      color: theme.colors.text.primary,
    },
    specialtyTextSelected: {
      color: theme.colors.text.light,
    },
    contactCard: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    contactHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    rateCard: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
  });

  const specialtyOptions: VendorSpecialty[] = [
    'plumbing',
    'electrical',
    'hvac',
    'carpentry',
    'painting',
    'landscaping',
    'cleaning',
    'security',
    'general',
  ];

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
    { label: 'Blacklisted', value: 'blacklisted' },
  ];

  const businessTypeOptions = [
    { label: 'Company', value: 'company' },
    { label: 'Individual', value: 'individual' },
  ];

  const rateTypeOptions = [
    { label: 'Hourly', value: 'hourly' },
    { label: 'Fixed', value: 'fixed' },
    { label: 'Variable', value: 'variable' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <Input
            label="Company Name"
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="Enter company name"
          />
          <View style={styles.row}>
            <Select
              label="Business Type"
              value={businessType}
              onValueChange={(value) => setBusinessType(value as 'individual' | 'company')}
              items={businessTypeOptions}
              style={styles.column}
            />
            <Select
              label="Status"
              value={status}
              onValueChange={(value) => setStatus(value as VendorStatus)}
              items={statusOptions}
              style={styles.column}
            />
          </View>
          <View style={styles.row}>
            <Input
              label="Tax ID"
              value={taxId}
              onChangeText={setTaxId}
              placeholder="Enter tax ID"
              style={styles.column}
            />
            <Input
              label="Registration Number"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              placeholder="Enter registration number"
              style={styles.column}
            />
          </View>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.specialtiesContainer}>
            {specialtyOptions.map((specialty) => (
              <TouchableOpacity
                key={specialty}
                onPress={() => handleSpecialtyToggle(specialty)}
                style={[
                  styles.specialtyButton,
                  specialties.includes(specialty) && styles.specialtyButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.specialtyText,
                    specialties.includes(specialty) && styles.specialtyTextSelected,
                  ]}
                >
                  {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contacts */}
        <View style={styles.section}>
          <View style={styles.contactHeader}>
            <Text style={styles.sectionTitle}>Contacts</Text>
            <Button
              title="Add Contact"
              onPress={handleAddContact}
              variant="outline"
              leftIcon="add"
              size="sm"
            />
          </View>
          {contacts.map((contact, index) => (
            <View key={index} style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <Text style={styles.sectionTitle}>Contact #{index + 1}</Text>
                {contacts.length > 1 && (
                  <Button
                    title="Remove"
                    onPress={() => handleRemoveContact(index)}
                    variant="outline"
                    leftIcon="trash"
                    size="sm"
                  />
                )}
              </View>
              <Input
                label="Name"
                value={contact.name}
                onChangeText={(value) => handleUpdateContact(index, 'name', value)}
                placeholder="Enter contact name"
              />
              <Input
                label="Email"
                value={contact.email}
                onChangeText={(value) => handleUpdateContact(index, 'email', value)}
                placeholder="Enter email address"
                keyboardType="email-address"
              />
              <Input
                label="Phone"
                value={contact.phone}
                onChangeText={(value) => handleUpdateContact(index, 'phone', value)}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
              <Input
                label="Role"
                value={contact.role}
                onChangeText={(value) => handleUpdateContact(index, 'role', value)}
                placeholder="Enter contact role"
              />
            </View>
          ))}
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <Input
            label="Street"
            value={street}
            onChangeText={setStreet}
            placeholder="Enter street address"
          />
          <View style={styles.row}>
            <Input
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="Enter city"
              style={styles.column}
            />
            <Input
              label="State/Province"
              value={state}
              onChangeText={setState}
              placeholder="Enter state/province"
              style={styles.column}
            />
          </View>
          <View style={styles.row}>
            <Input
              label="Postal Code"
              value={postalCode}
              onChangeText={setPostalCode}
              placeholder="Enter postal code"
              style={styles.column}
            />
            <Input
              label="Country"
              value={country}
              onChangeText={setCountry}
              placeholder="Enter country"
              style={styles.column}
            />
          </View>
        </View>

        {/* Service Rates */}
        <View style={styles.section}>
          <View style={styles.contactHeader}>
            <Text style={styles.sectionTitle}>Service Rates</Text>
            <Button
              title="Add Rate"
              onPress={handleAddServiceRate}
              variant="outline"
              leftIcon="add"
              size="sm"
            />
          </View>
          {serviceRates.map((rate, index) => (
            <View key={index} style={styles.rateCard}>
              <View style={styles.contactHeader}>
                <Text style={styles.sectionTitle}>Rate #{index + 1}</Text>
                <Button
                  title="Remove"
                  onPress={() => handleRemoveServiceRate(index)}
                  variant="outline"
                  leftIcon="trash"
                  size="sm"
                />
              </View>
              <Select
                label="Specialty"
                value={rate.specialty}
                onValueChange={(value) =>
                  handleUpdateServiceRate(index, 'specialty', value as VendorSpecialty)
                }
                items={specialtyOptions.map((s) => ({
                  label: s.charAt(0).toUpperCase() + s.slice(1),
                  value: s,
                }))}
              />
              <View style={styles.row}>
                <Input
                  label="Rate"
                  value={rate.rate.toString()}
                  onChangeText={(value) => handleUpdateServiceRate(index, 'rate', value)}
                  placeholder="Enter rate"
                  keyboardType="numeric"
                  style={styles.column}
                />
                <Select
                  label="Rate Type"
                  value={rate.rateType}
                  onValueChange={(value) => handleUpdateServiceRate(index, 'rateType', value)}
                  items={rateTypeOptions}
                  style={styles.column}
                />
              </View>
              <Input
                label="Currency"
                value={rate.currency}
                onChangeText={(value) => handleUpdateServiceRate(index, 'currency', value)}
                placeholder="Enter currency"
              />
            </View>
          ))}
        </View>

        {/* Insurance Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insurance Information</Text>
          <Input
            label="Insurance Provider"
            value={insuranceProvider}
            onChangeText={setInsuranceProvider}
            placeholder="Enter insurance provider"
          />
          <Input
            label="Policy Number"
            value={policyNumber}
            onChangeText={setPolicyNumber}
            placeholder="Enter policy number"
          />
          <DatePicker
            label="Expiry Date"
            value={insuranceExpiry}
            onChange={setInsuranceExpiry}
          />
          <Input
            label="Coverage Amount"
            value={coverageAmount}
            onChangeText={setCoverageAmount}
            placeholder="Enter coverage amount"
            keyboardType="numeric"
          />
        </View>

        {/* Bank Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bank Information</Text>
          <Input
            label="Bank Name"
            value={bankName}
            onChangeText={setBankName}
            placeholder="Enter bank name"
          />
          <Input
            label="Account Name"
            value={accountName}
            onChangeText={setAccountName}
            placeholder="Enter account name"
          />
          <Input
            label="Account Number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="Enter account number"
          />
          <Input
            label="Routing Number"
            value={routingNumber}
            onChangeText={setRoutingNumber}
            placeholder="Enter routing number"
          />
        </View>

        {/* Additional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <Input
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter additional notes"
            multiline
            numberOfLines={3}
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            style={{ flex: 1 }}
          />
          <Button
            title={initialData ? 'Update Vendor' : 'Create Vendor'}
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
} 