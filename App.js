import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [xp, setXp] = useState(0);
  const [hired, setHired] = useState(false);
  
  // Logic: Level up every 100 XP
  const level = Math.floor(xp / 100) + 1;
  const progress = (xp % 100);

  const handleWork = () => {
    setXp(prev => prev + 25);
    if (xp >= 75) setHired(true); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.badge}><Text style={styles.badgeText}>LVL {level}</Text></View>
        
        <Text style={styles.name}>Tirsit Belete</Text>
        <Text style={styles.sub}>Software Engineer (Samsun University)</Text>

        <View style={styles.xpBarContainer}>
          <Text style={styles.xpText}>XP to Next Level: {100 - progress}</Text>
          <View style={styles.barBackground}>
            <View style={[styles.barFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.btn, hired && styles.btnActive]} 
          onPress={handleWork}
        >
          <Text style={styles.btnText}>{hired ? "🚀 Working on Projects" : "🎯 Gain Experience"}</Text>
        </TouchableOpacity>
        
        <Text style={styles.footer}>Challenge 04: AIgile Mobile Cycle</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  card: { width: '85%', backgroundColor: '#1e293b', padding: 25, borderRadius: 24, alignItems: 'center', elevation: 10 },
  badge: { backgroundColor: '#38bdf8', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginBottom: 10 },
  badgeText: { color: '#000', fontWeight: '900' },
  name: { color: '#f8fafc', fontSize: 22, fontWeight: 'bold' },
  sub: { color: '#94a3b8', fontSize: 14, marginBottom: 20, textAlign: 'center' },
  xpBarContainer: { width: '100%', marginBottom: 30 },
  xpText: { color: '#64748b', fontSize: 12, marginBottom: 5 },
  barBackground: { height: 10, backgroundColor: '#334155', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#38bdf8' },
  btn: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 12, width: '100%', alignItems: 'center' },
  btnActive: { backgroundColor: '#22c55e' },
  btnText: { fontWeight: 'bold', color: '#0f172a' },
  footer: { marginTop: 20, color: '#475569', fontSize: 10 }
});