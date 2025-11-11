import { StyleSheet } from 'react-native';

export const settingsStyles = StyleSheet.create({
  settingsSection: {
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
  settingsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 22,
    letterSpacing: 0.3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ffd6ef',
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
  },
  settingValue: {
    flex: 1,
    alignItems: 'flex-end',
  },
  settingText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ffd6ef',
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ec4899',
  },
});
