import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { cardStyles } from '../../styles/cards';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface ProductsTabProps {
  products: Product[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  userRole: 'admin' | 'employee';
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  searchQuery,
  onSearchChange,
  onEditProduct,
  onDeleteProduct,
  userRole,
}) => {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatusColor = (product: Product): string => {
    if (product.stock <= product.minStock) return '#dc2626'; // Red
    if (product.stock <= product.minStock * 2) return '#f59e0b'; // Yellow
    return '#10b981'; // Green
  };

  const getStockStatusText = (product: Product): string => {
    if (product.stock <= product.minStock) return 'Low Stock';
    if (product.stock <= product.minStock * 2) return 'Medium Stock';
    return 'In Stock';
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={cardStyles.searchContainer}>
        <TextInput
          style={cardStyles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={cardStyles.customerCard}>
            <View style={cardStyles.customerHeader}>
              <Text style={cardStyles.customerName}>{item.name}</Text>
              <View style={[cardStyles.statusBadge, { backgroundColor: getStockStatusColor(item) }]}>
                <Text style={cardStyles.statusText}>{getStockStatusText(item)}</Text>
              </View>
            </View>
            <Text style={cardStyles.customerCompany}>SKU: {item.sku}</Text>
            <Text style={cardStyles.customerEmail}>Category: {item.category}</Text>
            <Text style={cardStyles.customerPhone}>
              Price: {formatCurrency(item.price, { currency: 'USD' })} | 
              Stock: {item.stock} | 
              Min: {item.minStock}
            </Text>
            {item.description && (
              <Text style={[cardStyles.customerPhone, { marginTop: 4, fontStyle: 'italic' }]}>
                {item.description}
              </Text>
            )}
            
            {userRole === 'admin' && (
              <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
                <TouchableOpacity
                  style={[cardStyles.completeButton, { backgroundColor: '#3b82f6', flex: 1 }]}
                  onPress={() => onEditProduct?.(item)}
                >
                  <Text style={cardStyles.completeButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[cardStyles.completeButton, { backgroundColor: '#dc2626', flex: 1 }]}
                  onPress={() => onDeleteProduct?.(item.id)}
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
