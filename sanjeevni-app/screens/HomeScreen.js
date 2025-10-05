import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';

const PATIENT_ID = 'p123';

export default function HomeScreen({ navigation }) {
  const [healthTip, setHealthTip] = useState(null);
  const [stats, setStats] = useState({
    appointments: 0,
    records: 0,
    reminders: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const tipResult = await api.getHealthTip();
    if (tipResult.success) {
      setHealthTip(tipResult.data);
    }

    const appointmentsResult = await api.getAppointments(PATIENT_ID);
    const recordsResult = await api.getRecords(PATIENT_ID);
    const remindersResult = await api.getReminders(PATIENT_ID);

    setStats({
      appointments: appointmentsResult.success ? appointmentsResult.data.length : 0,
      records: recordsResult.success ? recordsResult.data.length : 0,
      reminders: remindersResult.success ? remindersResult.data.length : 0,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to Sanjeevni! 🏥</Text>
        <Text style={styles.subtitle}>Your health companion</Text>
      </View>

      {/* Health Tip */}
      {healthTip && (
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Text style={styles.tipIcon}>{healthTip.icon}</Text>
            <Text style={styles.tipCategory}>{healthTip.category}</Text>
          </View>
          <Text style={styles.tipText}>{healthTip.tip}</Text>
        </View>
      )}

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { borderLeftColor: '#2196F3' }]}>
          <Ionicons name="calendar" size={28} color="#2196F3" />
          <Text style={styles.statCount}>{stats.appointments}</Text>
          <Text style={styles.statLabel}>Appointments</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#FF9800' }]}>
          <Ionicons name="document-text" size={28} color="#FF9800" />
          <Text style={styles.statCount}>{stats.records}</Text>
          <Text style={styles.statLabel}>Records</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#9C27B0' }]}>
          <Ionicons name="notifications" size={28} color="#9C27B0" />
          <Text style={styles.statCount}>{stats.reminders}</Text>
          <Text style={styles.statLabel}>Reminders</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#E8F5E9' }]}
          onPress={() => navigation.navigate('Doctors')}
        >
          <Ionicons name="medical" size={32} color="#4CAF50" />
          <Text style={styles.actionTitle}>Find Doctors</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#FFF3E0' }]}
          onPress={() => navigation.navigate('Records')}
        >
          <Ionicons name="document-text" size={32} color="#FF9800" />
          <Text style={styles.actionTitle}>My Records</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#F3E5F5' }]}
          onPress={() => navigation.navigate('Reminders')}
        >
          <Ionicons name="notifications" size={32} color="#9C27B0" />
          <Text style={styles.actionTitle}>Reminders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#E3F2FD' }]}
          onPress={() => navigation.navigate('Chat')}
        >
          <Ionicons name="chatbubbles" size={32} color="#2196F3" />
          <Text style={styles.actionTitle}>Health Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency */}
      <View style={styles.emergencyCard}>
        <Ionicons name="warning" size={24} color="#F44336" />
        <View style={styles.emergencyText}>
          <Text style={styles.emergencyTitle}>Emergency?</Text>
          <Text style={styles.emergencySubtitle}>Call 108 for ambulance</Text>
        </View>
        <View style={styles.emergencyButton}>
          <Ionicons name="call" size={20} color="#fff" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  tipCard: {
    backgroundColor: '#E8F5E9',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  tipCategory: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    margin: 5,
    borderRadius: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  actionCard: {
    width: '45%',
    margin: 5,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    marginBottom: 30,
  },
  emergencyText: {
    flex: 1,
    marginLeft: 10,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
  },
  emergencySubtitle: {
    fontSize: 12,
    color: '#666',
  },
  emergencyButton: {
    backgroundColor: '#F44336',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});