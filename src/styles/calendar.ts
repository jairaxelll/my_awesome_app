import { StyleSheet } from 'react-native';

export const calendarStyles = StyleSheet.create({
  calendarHeader: {
    backgroundColor: 'white',
    padding: 24,
    elevation: 4,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 6,
  },
  calendarDate: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '600',
  },
  calendarContent: {
    flex: 1,
  },
  calendarSection: {
    backgroundColor: 'white',
    margin: 18,
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#ec4899',
  },
  calendarSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  calendarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ffd6ef',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  calendarItemIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  calendarItemContent: {
    flex: 1,
  },
  calendarItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  calendarItemSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
});
