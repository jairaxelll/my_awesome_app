import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { modalStyles } from '../styles/modals';
import { ModalType } from '../types';

interface AddModalProps {
  visible: boolean;
  modalType: ModalType;
  formData: any;
  onFormDataChange: (field: string, value: any) => void;
  onAdd: () => void;
  onClose: () => void;
  isEditing?: boolean;
}

export const AddModal: React.FC<AddModalProps> = ({
  visible,
  modalType,
  formData,
  onFormDataChange,
  onAdd,
  onClose,
  isEditing = false,
}) => {
  const getModalTitle = () => {
    const prefix = isEditing ? 'Edit' : 'Add';
    switch (modalType) {
      case 'customer': return `${prefix} Customer`;
      case 'sale': return `${prefix} Sale`;
      case 'task': return `${prefix} Task`;
      case 'product': return `${prefix} Product`;
      case 'employee': return `${prefix} Employee`;
      default: return `${prefix} Item`;
    }
  };

  const renderCustomerFields = () => (
    <>
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Name"
        value={formData.name || ''}
        onChangeText={(text) => onFormDataChange('name', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Email"
        value={formData.email || ''}
        onChangeText={(text) => onFormDataChange('email', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Phone"
        value={formData.phone || ''}
        onChangeText={(text) => onFormDataChange('phone', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Company"
        value={formData.company || ''}
        onChangeText={(text) => onFormDataChange('company', text)}
      />
    </>
  );



  const renderTaskFields = () => (
    <>
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Task Title"
        value={formData.title || ''}
        onChangeText={(text) => onFormDataChange('title', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Description"
        value={formData.description || ''}
        onChangeText={(text) => onFormDataChange('description', text)}
        multiline
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Priority (low, medium, high, urgent)"
        value={formData.priority || ''}
        onChangeText={(text) => onFormDataChange('priority', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Due Date (YYYY-MM-DD)"
        value={formData.dueDate || ''}
        onChangeText={(text) => onFormDataChange('dueDate', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Assigned To"
        value={formData.assignedTo || ''}
        onChangeText={(text) => onFormDataChange('assignedTo', text)}
      />
    </>
  );


  const renderProductFields = () => (
    <>
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Product Name"
        value={formData.name || ''}
        onChangeText={(text) => onFormDataChange('name', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Description"
        value={formData.description || ''}
        onChangeText={(text) => onFormDataChange('description', text)}
        multiline
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Price"
        value={formData.price || ''}
        onChangeText={(text) => onFormDataChange('price', text)}
        keyboardType="numeric"
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Cost"
        value={formData.cost || ''}
        onChangeText={(text) => onFormDataChange('cost', text)}
        keyboardType="numeric"
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Category"
        value={formData.category || ''}
        onChangeText={(text) => onFormDataChange('category', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="SKU"
        value={formData.sku || ''}
        onChangeText={(text) => onFormDataChange('sku', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Stock Quantity"
        value={formData.stock || ''}
        onChangeText={(text) => onFormDataChange('stock', text)}
        keyboardType="numeric"
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Minimum Stock"
        value={formData.minStock || ''}
        onChangeText={(text) => onFormDataChange('minStock', text)}
        keyboardType="numeric"
      />
    </>
  );

  const renderSaleFields = () => (
    <>
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Customer ID"
        value={formData.customerId || ''}
        onChangeText={(text) => onFormDataChange('customerId', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Employee ID"
        value={formData.employeeId || ''}
        onChangeText={(text) => onFormDataChange('employeeId', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Product ID"
        value={formData.productId || ''}
        onChangeText={(text) => onFormDataChange('productId', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Quantity"
        value={formData.quantity || ''}
        onChangeText={(text) => onFormDataChange('quantity', text)}
        keyboardType="numeric"
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Discount"
        value={formData.discount || ''}
        onChangeText={(text) => onFormDataChange('discount', text)}
        keyboardType="numeric"
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Payment Method (cash, card, transfer, check)"
        value={formData.paymentMethod || ''}
        onChangeText={(text) => onFormDataChange('paymentMethod', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Sale Date (YYYY-MM-DD)"
        value={formData.saleDate || ''}
        onChangeText={(text) => onFormDataChange('saleDate', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Notes"
        value={formData.notes || ''}
        onChangeText={(text) => onFormDataChange('notes', text)}
        multiline
      />
    </>
  );

  const renderEmployeeFields = () => (
    <>
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Employee ID"
        value={formData.employeeId || ''}
        onChangeText={(text) => onFormDataChange('employeeId', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="First Name"
        value={formData.firstName || ''}
        onChangeText={(text) => onFormDataChange('firstName', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Last Name"
        value={formData.lastName || ''}
        onChangeText={(text) => onFormDataChange('lastName', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Email"
        value={formData.email || ''}
        onChangeText={(text) => onFormDataChange('email', text)}
        keyboardType="email-address"
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Phone"
        value={formData.phone || ''}
        onChangeText={(text) => onFormDataChange('phone', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Department"
        value={formData.department || ''}
        onChangeText={(text) => onFormDataChange('department', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Position"
        value={formData.position || ''}
        onChangeText={(text) => onFormDataChange('position', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Hire Date (YYYY-MM-DD)"
        value={formData.hireDate || ''}
        onChangeText={(text) => onFormDataChange('hireDate', text)}
      />
      <TextInput
        style={modalStyles.modalInput}
        placeholder="Salary"
        value={formData.salary || ''}
        onChangeText={(text) => onFormDataChange('salary', text)}
        keyboardType="numeric"
      />
    </>
  );

  const renderFields = () => {
    switch (modalType) {
      case 'customer': return renderCustomerFields();
      case 'sale': return renderSaleFields();
      case 'task': return renderTaskFields();
      case 'product': return renderProductFields();
      case 'employee': return renderEmployeeFields();
      default: return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>{getModalTitle()}</Text>
          
          <ScrollView 
            style={{ maxHeight: '70%' }}
            showsVerticalScrollIndicator={false}
          >
            {renderFields()}
          </ScrollView>

          <View style={modalStyles.modalButtons}>
            <TouchableOpacity style={modalStyles.modalButton} onPress={onClose}>
              <Text style={modalStyles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.modalButton, modalStyles.modalButtonPrimary]}
              onPress={onAdd}
            >
              <Text style={[modalStyles.modalButtonText, modalStyles.modalButtonTextPrimary]}>
                {isEditing ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
