import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { cardStyles } from '../../styles/cards';
import { Sale } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface SalesTabProps {
  sales: Sale[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEditSale?: (sale: Sale) => void;
  onDeleteSale?: (saleId: string) => void;
  userRole: 'admin' | 'employee';
}

export const SalesTab: React.FC<SalesTabProps> = ({
  sales,
  searchQuery,
  onSearchChange,
  onEditSale,
  onDeleteSale,
  userRole,
}) => {
  const filteredSales = sales.filter(sale =>
    sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.products.some(p => p.productName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#dc2626';
      case 'refunded': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPaymentMethodIcon = (method: string): string => {
    switch (method) {
      case 'cash': return 'cash';
      case 'card': return 'credit-card';
      case 'transfer': return 'bank-transfer';
      case 'check': return 'checkbook';
      default: return 'currency-usd';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={cardStyles.searchContainer}>
        <TextInput
          style={cardStyles.searchInput}
          placeholder="Search sales..."
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      <FlatList
        data={filteredSales}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={cardStyles.customerCard}>
            <View style={cardStyles.customerHeader}>
              <Text style={cardStyles.customerName}>Sale #{item.id}</Text>
              <View style={[cardStyles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={cardStyles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={cardStyles.customerCompany}>Customer: {item.customerName}</Text>
            <Text style={cardStyles.customerEmail}>Employee: {item.employeeName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={cardStyles.customerPhone}>
                Amount: {formatCurrency(item.finalAmount, { currency: 'USD' })} | 
              </Text>
              <Icon name={getPaymentMethodIcon(item.paymentMethod)} size={14} color="#94a3b8" style={{ marginHorizontal: 4 }} />
              <Text style={cardStyles.customerPhone}>{item.paymentMethod}</Text>
            </View>
            <Text style={[cardStyles.customerPhone, { marginTop: 4 }]}>
              Date: {formatDate(item.saleDate)}
            </Text>
            
            <View style={{ marginTop: 8 }}>
              <Text style={[cardStyles.customerPhone, { fontWeight: '600' }]}>Products:</Text>
              {item.products.map((product, index) => (
                <Text key={index} style={[cardStyles.customerPhone, { marginLeft: 8 }]}>
                  • {product.productName} (Qty: {product.quantity}) - {formatCurrency(product.totalPrice, { currency: 'USD' })}
                </Text>
              ))}
            </View>

            {item.notes && (
              <Text style={[cardStyles.customerPhone, { marginTop: 4, fontStyle: 'italic' }]}>
                Notes: {item.notes}
              </Text>
            )}
            
            {userRole === 'admin' && (
              <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
                <TouchableOpacity
                  style={[cardStyles.completeButton, { backgroundColor: '#3b82f6', flex: 1 }]}
                  onPress={() => onEditSale?.(item)}
                >
                  <Text style={cardStyles.completeButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[cardStyles.completeButton, { backgroundColor: '#dc2626', flex: 1 }]}
                  onPress={() => onDeleteSale?.(item.id)}
                >
                  <Text style={cardStyles.completeButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
