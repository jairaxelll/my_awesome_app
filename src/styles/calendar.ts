import { StyleSheet } from 'react-native';

export const calendarStyles = StyleSheet.create({
  calendarHeader: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  calendarDate: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  calendarContent: {
    flex: 1,
  },
  calendarSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  calendarSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  calendarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  calendarItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  calendarItemContent: {
    flex: 1,
  },
  calendarItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  calendarItemSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
});
