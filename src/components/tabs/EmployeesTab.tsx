import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { cardStyles } from '../../styles/cards';
import { Employee } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';

interface EmployeesTabProps {
  employees: Employee[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEditEmployee?: (employee: Employee) => void;
  onDeleteEmployee?: (employeeId: string) => void;
  userRole: 'admin' | 'employee';
}

export const EmployeesTab: React.FC<EmployeesTabProps> = ({
  employees,
  searchQuery,
  onSearchChange,
  onEditEmployee,
  onDeleteEmployee,
  userRole,
}) => {
  const filteredEmployees = employees.filter(employee =>
    employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (isActive: boolean): string => {
    return isActive ? '#10b981' : '#dc2626';
  };

  const getStatusText = (isActive: boolean): string => {
    return isActive ? 'Active' : 'Inactive';
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={cardStyles.searchContainer}>
        <TextInput
          style={cardStyles.searchInput}
          placeholder="Search employees..."
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={cardStyles.customerCard}>
            <View style={cardStyles.customerHeader}>
              <Text style={cardStyles.customerName}>{item.firstName} {item.lastName}</Text>
              <View style={[cardStyles.statusBadge, { backgroundColor: getStatusColor(item.isActive) }]}>
                <Text style={cardStyles.statusText}>{getStatusText(item.isActive)}</Text>
              </View>
            </View>
            <Text style={cardStyles.customerCompany}>ID: {item.employeeId}</Text>
            <Text style={cardStyles.customerEmail}>{item.email}</Text>
            <Text style={cardStyles.customerPhone}>{item.phone}</Text>
            <Text style={[cardStyles.customerPhone, { marginTop: 4 }]}>
              Department: {item.department} | Position: {item.position}
            </Text>
            <Text style={[cardStyles.customerPhone, { marginTop: 4 }]}>
              Hire Date: {formatDate(item.hireDate)}
            </Text>
            {item.salary && (
              <Text style={[cardStyles.customerPhone, { marginTop: 4, fontWeight: '600' }]}>
                Salary: {formatCurrency(item.salary, { currency: 'USD' })}
              </Text>
            )}
            
            {userRole === 'admin' && (
              <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
                <TouchableOpacity
                  style={[cardStyles.completeButton, { backgroundColor: '#3b82f6', flex: 1 }]}
                  onPress={() => onEditEmployee?.(item)}
                >
                  <Text style={cardStyles.completeButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[cardStyles.completeButton, { backgroundColor: '#dc2626', flex: 1 }]}
                  onPress={() => onDeleteEmployee?.(item.id)}
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
