import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';

export default function App() {
  // User input states
  const [petName, setPetName] = useState('');
  const [tempPetName, setTempPetName] = useState(''); // Temporary name while typing
  const [petType, setPetType] = useState('');
  const [showNameModal, setShowNameModal] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Current room/screen
  const [currentRoom, setCurrentRoom] = useState('main');
  
  // Pet state
  const [hunger, setHunger] = useState(50);
  const [happiness, setHappiness] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [age, setAge] = useState(0);
  const [evolution, setEvolution] = useState(1);
  const [coins, setCoins] = useState(100);
  const [inventory, setInventory] = useState({
    food: 3,
    toys: 2,
    medicine: 1
  });

  // Available pet types
  const petTypes = [
    { emoji: '🐉', name: 'Dragon' },
    { emoji: '🐱', name: 'Cat' },
    { emoji: '🐶', name: 'Dog' },
    { emoji: '🦊', name: 'Fox' },
    { emoji: '🐼', name: 'Panda' },
    { emoji: '🦄', name: 'Unicorn' }
  ];

  // Timer for aging and decreasing stats
  useEffect(() => {
    if (!gameStarted) return;
    
    const timer = setInterval(() => {
      setHunger(prev => Math.min(prev + 2, 100));
      setHappiness(prev => Math.max(prev - 1, 0));
      setEnergy(prev => Math.max(prev - 1, 0));
      setAge(prev => prev + 1);
      
      if (age % 5 === 0) {
        setCoins(prev => prev + 10);
      }
    }, 5000);
    
    return () => clearInterval(timer);
  }, [gameStarted, age]);

  // Check for evolution
  useEffect(() => {
    if (!gameStarted) return;
    
    if (age >= 10 && evolution === 1) {
      setEvolution(2);
      Alert.alert(
        '✨ Evolution!',
        `${petName} evolved into a Teenage ${petType}!`,
        [{ text: 'Awesome!' }]
      );
      Vibration.vibrate(100);
    }
    if (age >= 20 && evolution === 2) {
      setEvolution(3);
      Alert.alert(
        '🌟 Adult Evolution!',
        `${petName} evolved into an Adult ${petType}!`,
        [{ text: 'Wow!' }]
      );
      Vibration.vibrate([0, 100, 50, 100]);
    }
    if (age >= 30 && evolution === 3) {
      setEvolution(4);
      Alert.alert(
        '👑 King Evolution!',
        `${petName} evolved into the KING ${petType}!`,
        [{ text: 'All Hail the King!' }]
      );
      Vibration.vibrate([0, 100, 50, 100, 50, 100]);
    }
  }, [age, evolution, gameStarted]);

  // Warning system
  useEffect(() => {
    if (!gameStarted) return;
    
    if (hunger >= 85) {
      Alert.alert('🍖 Hungry!', `${petName} is starving! Go to kitchen!`);
    }
    if (happiness <= 15) {
      Alert.alert('😢 Sad!', `${petName} is very sad! Go to playground!`);
    }
    if (energy <= 15) {
      Alert.alert('😴 Tired!', `${petName} is exhausted! Go to bedroom!`);
    }
  }, [hunger, happiness, energy]);

  const startGame = () => {
    if (!tempPetName.trim()) {
      Alert.alert('Error', 'Please give your pet a name!');
      return;
    }
    if (!petType) {
      Alert.alert('Error', 'Please select a pet type!');
      return;
    }
    setPetName(tempPetName); // Set the final name only when starting
    setShowNameModal(false);
    setGameStarted(true);
    Vibration.vibrate(100);
  };

  // Kitchen actions
  const handleFeed = () => {
    if (inventory.food <= 0) {
      Alert.alert('No Food!', 'You need to buy food from the shop!');
      return;
    }

    setHunger(prev => Math.max(prev - 25, 0));
    setHappiness(prev => Math.min(prev + 5, 100));
    setInventory(prev => ({ ...prev, food: prev.food - 1 }));
    
    const foods = ['🍖 meat', '🐟 fish', '🥕 carrot', '🍎 apple'];
    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    
    Alert.alert('🍽️ Yummy!', `${petName} ate ${randomFood}! -25 Hunger`);
    Vibration.vibrate(50);
  };

  const handleBuyFood = () => {
    if (coins < 15) {
      Alert.alert('Not Enough Coins!', 'You need 15 coins to buy food.');
      return;
    }
    setCoins(prev => prev - 15);
    setInventory(prev => ({ ...prev, food: prev.food + 1 }));
    Alert.alert('🛒 Purchased!', 'You bought 1 food for 15 coins!');
  };

  // Playground actions
  const handlePlay = () => {
    if (energy < 20) {
      Alert.alert('Too Tired!', `${petName} is too tired to play! Go to bedroom first.`);
      return;
    }

    setHappiness(prev => Math.min(prev + 20, 100));
    setHunger(prev => Math.min(prev + 8, 100));
    setEnergy(prev => Math.max(prev - 15, 0));
    setCoins(prev => prev + 10);
    
    const games = ['🎾 fetch', '🪁 flying', '🏃 running', '🧩 puzzles'];
    const randomGame = games[Math.floor(Math.random() * games.length)];
    
    Alert.alert('🎉 Fun!', `You played ${randomGame}! +20 Happiness, +10 coins`);
    Vibration.vibrate([0, 50, 30, 50]);
  };

  const handleBuyToy = () => {
    if (coins < 25) {
      Alert.alert('Not Enough Coins!', 'You need 25 coins to buy a toy.');
      return;
    }
    setCoins(prev => prev - 25);
    setInventory(prev => ({ ...prev, toys: prev.toys + 1 }));
    Alert.alert('🛒 Purchased!', 'You bought 1 toy for 25 coins!');
  };

  // Bedroom actions
  const handleSleep = () => {
    setEnergy(prev => Math.min(prev + 40, 100));
    setHappiness(prev => Math.min(prev + 5, 100));
    
    Alert.alert('😴 Sweet Dreams...', `${petName} slept peacefully! +40 Energy`);
  };

  // Main room action
  const handleClean = () => {
    if (coins < 5) {
      Alert.alert('Not Enough Coins!', 'You need 5 coins to clean.');
      return;
    }
    setHappiness(prev => Math.min(prev + 10, 100));
    setCoins(prev => prev - 5);
    
    Alert.alert('🧼 Clean!', `${petName}'s home is clean! +10 Happiness (-5 coins)`);
  };

  // Get pet emoji with proper size
  const getPetEmoji = () => {
    if (!gameStarted) return '🥚';
    
    const selectedType = petTypes.find(t => t.name === petType);
    const baseEmoji = selectedType?.emoji || '🐉';
    
    // King evolution (age 30+)
    if (evolution >= 4) return '👑';
    
    // Adult evolution (age 20-29)
    if (evolution >= 3) return baseEmoji;
    
    // Teen evolution (age 10-19)
    if (evolution >= 2) return baseEmoji;
    
    // Baby
    return '🥚';
  };

  const getMoodDescription = () => {
    if (hunger >= 85) return 'Starving! 🍖';
    if (hunger >= 70) return 'Hungry 🍽️';
    if (happiness >= 80) return 'Ecstatic! 🎉';
    if (happiness >= 60) return 'Happy 😊';
    if (happiness <= 20) return 'Depressed 😢';
    if (energy <= 20) return 'Exhausted 😴';
    return 'Content 🙂';
  };

  // Room navigation
  const RoomNavigation = () => (
    <View style={styles.roomNav}>
      <TouchableOpacity 
        style={[styles.roomButton, currentRoom === 'main' && styles.roomActive]} 
        onPress={() => setCurrentRoom('main')}
      >
        <Text style={styles.roomEmoji}>🏠</Text>
        <Text style={styles.roomText}>Main</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.roomButton, currentRoom === 'kitchen' && styles.roomActive]} 
        onPress={() => setCurrentRoom('kitchen')}
      >
        <Text style={styles.roomEmoji}>🍳</Text>
        <Text style={styles.roomText}>Kitchen</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.roomButton, currentRoom === 'playground' && styles.roomActive]} 
        onPress={() => setCurrentRoom('playground')}
      >
        <Text style={styles.roomEmoji}>🎪</Text>
        <Text style={styles.roomText}>Play</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.roomButton, currentRoom === 'bedroom' && styles.roomActive]} 
        onPress={() => setCurrentRoom('bedroom')}
      >
        <Text style={styles.roomEmoji}>🛏️</Text>
        <Text style={styles.roomText}>Bedroom</Text>
      </TouchableOpacity>
    </View>
  );

  // Name Input Modal - Fixed to not reload on each letter
  const NameInputModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showNameModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>🎮 Create Your Pet!</Text>
          
          <Text style={styles.modalLabel}>Pet Name:</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter pet name..."
            placeholderTextColor="#64748b"
            value={tempPetName} // Using temp state
            onChangeText={setTempPetName} // Updates temp only
            maxLength={20}
          />

          <Text style={styles.modalLabel}>Choose Pet Type:</Text>
          <View style={styles.petTypeGrid}>
            {petTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.petTypeButton,
                  petType === type.name && styles.petTypeSelected
                ]}
                onPress={() => setPetType(type.name)}
              >
                <Text style={styles.petTypeEmoji}>{type.emoji}</Text>
                <Text style={styles.petTypeName}>{type.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.startButton}
            onPress={startGame}
          >
            <Text style={styles.startButtonText}>Start Game!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (!gameStarted) {
    return <NameInputModal />;
  }

  // Render different rooms
  const renderRoom = () => {
    switch(currentRoom) {
      case 'kitchen':
        return (
          <View style={styles.roomContent}>
            <Text style={styles.roomTitle}>🍳 KITCHEN</Text>
            <Text style={styles.roomEmojiLarge}>🍽️ 🍲 🥘</Text>
            
            <View style={styles.roomActions}>
              <TouchableOpacity 
                style={[styles.roomActionButton, styles.feedButton]} 
                onPress={handleFeed}
              >
                <Text style={styles.actionEmoji}>🍖</Text>
                <Text style={styles.actionText}>Feed Pet</Text>
                <Text style={styles.actionDetail}>-25 Hunger</Text>
                <Text style={styles.actionInventory}>Food: {inventory.food}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.roomActionButton, styles.shopButton]} 
                onPress={handleBuyFood}
              >
                <Text style={styles.actionEmoji}>🛒</Text>
                <Text style={styles.actionText}>Buy Food</Text>
                <Text style={styles.actionDetail}>15 coins</Text>
                <Text style={styles.actionInventory}>Coins: {coins}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'playground':
        return (
          <View style={styles.roomContent}>
            <Text style={styles.roomTitle}>🎪 PLAYGROUND</Text>
            <Text style={styles.roomEmojiLarge}>🎡 🎠 🎢</Text>
            
            <View style={styles.roomActions}>
              <TouchableOpacity 
                style={[styles.roomActionButton, styles.playButton]} 
                onPress={handlePlay}
              >
                <Text style={styles.actionEmoji}>🎮</Text>
                <Text style={styles.actionText}>Play Games</Text>
                <Text style={styles.actionDetail}>+20 Happy, +10 coins</Text>
                <Text style={styles.actionEnergy}>Energy: {energy}%</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.roomActionButton, styles.shopButton]} 
                onPress={handleBuyToy}
              >
                <Text style={styles.actionEmoji}>🧸</Text>
                <Text style={styles.actionText}>Buy Toy</Text>
                <Text style={styles.actionDetail}>25 coins</Text>
                <Text style={styles.actionInventory}>Toys: {inventory.toys}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'bedroom':
        return (
          <View style={styles.roomContent}>
            <Text style={styles.roomTitle}>🛏️ BEDROOM</Text>
            <Text style={styles.roomEmojiLarge}>🛌 🌙 ⭐</Text>
            
            <View style={styles.roomActions}>
              <TouchableOpacity 
                style={[styles.roomActionButton, styles.sleepButton]} 
                onPress={handleSleep}
              >
                <Text style={styles.actionEmoji}>😴</Text>
                <Text style={styles.actionText}>Sleep</Text>
                <Text style={styles.actionDetail}>+40 Energy</Text>
                <Text style={styles.actionEnergy}>Current: {energy}%</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default: // Main room
        return (
          <View style={styles.roomContent}>
            <Text style={styles.roomTitle}>🏠 MAIN ROOM</Text>
            
            {/* Pet Avatar - Fixed size issue */}
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarEmoji}>{getPetEmoji()}</Text>
            </View>
            
            {/* Pet Info */}
            <Text style={styles.name}>{petName}</Text>
            <Text style={styles.type}>
              {petTypes.find(t => t.name === petType)?.emoji} {petType}
            </Text>
            <Text style={styles.mood}>Mood: {getMoodDescription()}</Text>

            {/* Stats Bars */}
            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={styles.statEmoji}>🍖</Text>
                <View style={styles.statBarBg}>
                  <View style={[styles.statBarFill, { width: `${hunger}%`, backgroundColor: hunger > 70 ? '#ef4444' : '#f59e0b' }]} />
                </View>
                <Text style={styles.statValue}>{hunger}%</Text>
              </View>

              <View style={styles.statRow}>
                <Text style={styles.statEmoji}>😊</Text>
                <View style={styles.statBarBg}>
                  <View style={[styles.statBarFill, { width: `${happiness}%`, backgroundColor: happiness < 30 ? '#ef4444' : '#f59e0b' }]} />
                </View>
                <Text style={styles.statValue}>{happiness}%</Text>
              </View>

              <View style={styles.statRow}>
                <Text style={styles.statEmoji}>⚡</Text>
                <View style={styles.statBarBg}>
                  <View style={[styles.statBarFill, { width: `${energy}%`, backgroundColor: energy < 20 ? '#ef4444' : '#3b82f6' }]} />
                </View>
                <Text style={styles.statValue}>{energy}%</Text>
              </View>
            </View>

            {/* Clean Button */}
            <TouchableOpacity 
              style={[styles.cleanButton, styles.fullWidthButton]} 
              onPress={handleClean}
            >
              <Text style={styles.cleanButtonEmoji}>🧼</Text>
              <Text style={styles.cleanButtonText}>Clean Home (5 coins)</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.evolutionBadge}>
          <Text style={styles.evolutionText}>
            {evolution === 1 && '🥚 Baby'}
            {evolution === 2 && '🐉 Teen'}
            {evolution === 3 && '🐲 Adult'}
            {evolution === 4 && '👑 KING'}
          </Text>
        </View>
        <View style={styles.coinsBadge}>
          <Text style={styles.coinsText}>🪙 {coins}</Text>
        </View>
        <View style={styles.ageBadge}>
          <Text style={styles.ageText}>📅 {age}</Text>
        </View>
      </View>

      {/* Inventory Bar */}
      <View style={styles.inventoryBar}>
        <View style={styles.inventoryItem}>
          <Text style={styles.inventoryEmoji}>🍖</Text>
          <Text style={styles.inventoryCount}>{inventory.food}</Text>
        </View>
        <View style={styles.inventoryItem}>
          <Text style={styles.inventoryEmoji}>🧸</Text>
          <Text style={styles.inventoryCount}>{inventory.toys}</Text>
        </View>
        <View style={styles.inventoryItem}>
          <Text style={styles.inventoryEmoji}>💊</Text>
          <Text style={styles.inventoryCount}>{inventory.medicine}</Text>
        </View>
      </View>

      {/* Room Navigation */}
      <RoomNavigation />

      {/* Current Room Content */}
      <ScrollView 
        style={styles.roomScrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderRoom()}
      </ScrollView>

      <Text style={styles.footer}>Challenge 04: Digital Pet Tamagotchi</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  evolutionBadge: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  evolutionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  coinsBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  coinsText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ageBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ageText: {
    color: '#f8fafc',
    fontSize: 14,
  },
  inventoryBar: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 15,
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  inventoryEmoji: {
    fontSize: 20,
  },
  inventoryCount: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  roomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  roomButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#1e293b',
    minWidth: 70,
  },
  roomActive: {
    backgroundColor: '#38bdf8',
  },
  roomEmoji: {
    fontSize: 24,
  },
  roomText: {
    color: '#f8fafc',
    fontSize: 11,
    marginTop: 4,
  },
  roomScrollView: {
    flex: 1,
    marginBottom: 10,
  },
  roomContent: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  roomTitle: {
    color: '#38bdf8',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  roomEmojiLarge: {
    fontSize: 40,
    marginBottom: 20,
    color: '#f8fafc',
  },
  roomActions: {
    width: '100%',
    gap: 15,
  },
  roomActionButton: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  actionDetail: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  actionInventory: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    opacity: 0.8,
  },
  actionEnergy: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    opacity: 0.8,
  },
  feedButton: {
    backgroundColor: '#f59e0b',
  },
  playButton: {
    backgroundColor: '#3b82f6',
  },
  sleepButton: {
    backgroundColor: '#8b5cf6',
  },
  shopButton: {
    backgroundColor: '#10b981',
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#38bdf8',
    overflow: 'hidden',
  },
  avatarEmoji: {
    fontSize: 90,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  name: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  type: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  mood: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  statEmoji: {
    fontSize: 18,
    width: 25,
  },
  statBarBg: {
    flex: 1,
    height: 12,
    backgroundColor: '#334155',
    borderRadius: 6,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 12,
    width: 40,
    textAlign: 'right',
  },
  cleanButton: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  fullWidthButton: {
    width: '100%',
  },
  cleanButtonEmoji: {
    fontSize: 24,
  },
  cleanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.95)',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    padding: 25,
    borderRadius: 30,
    width: '85%',
    borderWidth: 2,
    borderColor: '#38bdf8',
  },
  modalTitle: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalLabel: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  modalInput: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  petTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  petTypeButton: {
    width: '30%',
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  petTypeSelected: {
    borderColor: '#38bdf8',
    backgroundColor: '#1e3a4a',
  },
  petTypeEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  petTypeName: {
    color: '#f8fafc',
    fontSize: 12,
  },
  startButton: {
    backgroundColor: '#22c55e',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    color: '#475569',
    fontSize: 11,
    textAlign: 'center',
    paddingBottom: 10,
  },
});