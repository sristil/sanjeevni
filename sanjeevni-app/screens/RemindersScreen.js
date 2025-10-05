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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';

const PATIENT_ID = 'p123';

export default function RemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('medicine');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('daily');

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    setLoading(true);
    const result = await api.getReminders(PATIENT_ID);
    if (result.success) {
      setReminders(result.data);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReminders();
    setRefreshing(false);
  };

  const handleAddReminder = async () => {
    if (!title || !time) {
      Alert.alert('Error', 'Please fill in title and time');
      return;
    }

    const reminderData = {
      patientId: PATIENT_ID,
      type,
      title,
      description,
      time,
      frequency,
    };

    const result = await api.createReminder(reminderData);
    if (result.success) {
      Alert.alert('Success', 'Reminder created successfully!');
      setShowAdd(false);
      clearForm();
      loadReminders();
    } else {
      Alert.alert('Error', 'Failed to create reminder');
    }
  };

  const handleToggleReminder = async (id) => {
    const result = await api.toggleReminder(id);
    if (result.success) {
      loadReminders();
    }
  };

  const handleDeleteReminder = (id) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await api.deleteReminder(id);
            if (result.success) {
              loadReminders();
            }
          },
        },
      ]
    );
  };

  const clearForm = () => {
    setTitle('');
    setType('medicine');
    setDescription('');
    setTime('');
    setFrequency('daily');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'medicine':
        return 'medical';
      case 'appointment':
        return 'calendar';
      case 'test':
        return 'flask';
      case 'refill':
        return 'repeat';
      default:
        return 'notifications';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'medicine':
        return '#4CAF50';
      case 'appointment':
        return '#2196F3';
      case 'test':
        return '#FF9800';
      case 'refill':
        return '#9C27B0';
      default:
        return '#666';
    }
  };

  const ReminderCard = ({ reminder }) => (
    <View style={[styles.reminderCard, !reminder.active && styles.reminderCardInactive]}>
      <View style={styles.reminderHeader}>
        <View style={[styles.typeIcon, { backgroundColor: getTypeColor(reminder.type) + '20' }]}>
          <Ionicons name={getTypeIcon(reminder.type)} size={24} color={getTypeColor(reminder.type)} />
        </View>
        <View style={styles.reminderInfo}>
          <Text style={styles.reminderTitle}>{reminder.title}</Text>
          <Text style={styles.reminderType}>{reminder.type.toUpperCase()}</Text>
        </View>
        <Switch
          value={reminder.active}
          onValueChange={() => handleToggleReminder(reminder.id)}
          trackColor={{ false: '#ccc', true: '#4CAF50' }}
        />
      </View>

      {reminder.description && (
        <Text style={styles.reminderDescription}>{reminder.description}</Text>
      )}

      <View style={styles.reminderDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.detailText}>{reminder.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="repeat" size={16} color="#666" />
          <Text style={styles.detailText}>{reminder.frequency}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteReminder(reminder.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#F44336" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reminders}
        renderItem={({ item }) => <ReminderCard reminder={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {loading ? 'Loading reminders...' : 'No reminders set'}
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => setShowAdd(true)}
            >
              <Text style={styles.addFirstButtonText}>Create Your First Reminder</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Add Reminder Modal */}
      <Modal visible={showAdd} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Reminder</Text>
              <TouchableOpacity onPress={() => setShowAdd(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Take Paracetamol"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Type</Text>
                <View style={styles.typeButtons}>
                  {['medicine', 'appointment', 'test', 'refill'].map((t) => (
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
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Time (HH:MM) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 09:00"
                  value={time}
                  onChangeText={setTime}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Frequency</Text>
                <View style={styles.typeButtons}>
                  {['daily', 'weekly', 'monthly'].map((f) => (
                    <TouchableOpacity
                      key={f}
                      style={[
                        styles.typeButton,
                        frequency === f && styles.typeButtonActive,
                      ]}
                      onPress={() => setFrequency(f)}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          frequency === f && styles.typeButtonTextActive,
                        ]}
                      >
                        {f}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="e.g., After breakfast"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleAddReminder}
              >
                <Text style={styles.confirmButtonText}>Create Reminder</Text>
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
  reminderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  reminderCardInactive: {
    opacity: 0.6,
  },
  reminderHeader: {
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
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reminderType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  reminderDetails: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  deleteButtonText: {
    color: '#F44336',
    marginLeft: 5,
    fontSize: 14,
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
    backgroundColor: '#9C27B0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
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
    maxHeight: '85%',
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
    backgroundColor: '#9C27B0',
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
    backgroundColor: '#9C27B0',
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