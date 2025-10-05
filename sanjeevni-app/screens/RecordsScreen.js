import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';

const PATIENT_ID = 'p123';

export default function RecordsScreen() {
  const [records, setRecords] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('prescription');
  const [description, setDescription] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [hospital, setHospital] = useState('');
  const [medicines, setMedicines] = useState('');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    const result = await api.getRecords(PATIENT_ID);
    if (result.success) {
      setRecords(result.data);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecords();
    setRefreshing(false);
  };

  const handleAddRecord = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    const recordData = {
      patientId: PATIENT_ID,
      type,
      title,
      description,
      doctorName,
      hospital,
      medicines: medicines ? medicines.split(',').map(m => m.trim()) : [],
    };

    const result = await api.addRecord(recordData);
    if (result.success) {
      Alert.alert('Success', 'Record added successfully!');
      setShowAdd(false);
      clearForm();
      loadRecords();
    } else {
      Alert.alert('Error', 'Failed to add record');
    }
  };

  const handleDeleteRecord = (id) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await api.deleteRecord(id);
            if (result.success) {
              loadRecords();
            }
          },
        },
      ]
    );
  };

  const clearForm = () => {
    setTitle('');
    setType('prescription');
    setDescription('');
    setDoctorName('');
    setHospital('');
    setMedicines('');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'prescription':
        return 'medical';
      case 'test_result':
        return 'flask';
      case 'diagnosis':
        return 'pulse';
      case 'vaccine':
        return 'shield-checkmark';
      default:
        return 'document-text';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'prescription':
        return '#4CAF50';
      case 'test_result':
        return '#2196F3';
      case 'diagnosis':
        return '#FF9800';
      case 'vaccine':
        return '#9C27B0';
      default:
        return '#666';
    }
  };

  const RecordCard = ({ record }) => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <View style={[styles.typeIcon, { backgroundColor: getTypeColor(record.type) + '20' }]}>
          <Ionicons name={getTypeIcon(record.type)} size={24} color={getTypeColor(record.type)} />
        </View>
        <View style={styles.recordInfo}>
          <Text style={styles.recordTitle}>{record.title}</Text>
          <Text style={styles.recordType}>{record.type.replace('_', ' ').toUpperCase()}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteRecord(record.id)}>
          <Ionicons name="trash-outline" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>

      {record.description && (
        <Text style={styles.recordDescription}>{record.description}</Text>
      )}

      <View style={styles.recordDetails}>
        {record.doctorName !== 'N/A' && (
          <View style={styles.detailRow}>
            <Ionicons name="person" size={16} color="#666" />
            <Text style={styles.detailText}>Dr. {record.doctorName}</Text>
          </View>
        )}
        {record.hospital !== 'N/A' && (
          <View style={styles.detailRow}>
            <Ionicons name="business" size={16} color="#666" />
            <Text style={styles.detailText}>{record.hospital}</Text>
          </View>
        )}
        {record.medicines && record.medicines.length > 0 && (
          <View style={styles.detailRow}>
            <Ionicons name="bandage" size={16} color="#666" />
            <Text style={styles.detailText}>{record.medicines.join(', ')}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(record.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        renderItem={({ item }) => <RecordCard record={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {loading ? 'Loading records...' : 'No medical records yet'}
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => setShowAdd(true)}
            >
              <Text style={styles.addFirstButtonText}>Add Your First Record</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Add Record Modal */}
      <Modal visible={showAdd} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Medical Record</Text>
              <TouchableOpacity onPress={() => setShowAdd(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Fever Treatment"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Type</Text>
                <View style={styles.typeButtons}>
                  {['prescription', 'test_result', 'diagnosis', 'vaccine'].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.typeButton,
                        type === t && styles.typeButtonActive,
                      ]}
                      onPress={() => setType(t)}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          type === t && styles.typeButtonTextActive,
                        ]}
                      >
                        {t.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter details..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Doctor Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Dr. Sharma"
                  value={doctorName}
                  onChangeText={setDoctorName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Hospital</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Apollo Hospital"
                  value={hospital}
                  onChangeText={setHospital}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Medicines (comma separated)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Paracetamol 500mg, Vitamin C"
                  value={medicines}
                  onChangeText={setMedicines}
                />
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleAddRecord}
              >
                <Text style={styles.confirmButtonText}>Add Record</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 15,
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recordType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  recordDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  recordDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    marginBottom: 20,
  },
  addFirstButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  addFirstButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  typeButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});