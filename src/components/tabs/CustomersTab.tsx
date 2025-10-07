import React from 'react';
import { View, Text, FlatList, TextInput } from 'react-native';
import { cardStyles } from '../../styles/cards';
import { Customer } from '../../types';
import { getStatusColor } from '../../utils/helpers';

interface CustomersTabProps {
  customers: Customer[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({
  customers,
  searchQuery,
  onSearchChange,
}) => {
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={cardStyles.searchContainer}>
        <TextInput
          style={cardStyles.searchInput}
          placeholder="Search customers..."
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={cardStyles.customerCard}>
            <View style={cardStyles.customerHeader}>
              <Text style={cardStyles.customerName}>{item.name}</Text>
              <View style={[cardStyles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={cardStyles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={cardStyles.customerCompany}>{item.company}</Text>
            <Text style={cardStyles.customerEmail}>{item.email}</Text>
            <Text style={cardStyles.customerPhone}>{item.phone}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
