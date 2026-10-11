import React, {createContext, useContext, useState, useEffect} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalText from '../GlobalText';
import {useTheme} from '../../context/MainContext';

const {width, height} = Dimensions.get('window');

type HintStep = {
  id: string;
  targetRef: React.RefObject<any>;
  text: string;
};

interface HintTourContextType {
  registerStep: (step: HintStep) => void;
  startTour: () => void;
}

const HintTourContext = createContext<HintTourContextType | undefined>(
  undefined,
);

export const HintTourProvider = ({children}: {children: React.ReactNode}) => {
  const [steps, setSteps] = useState<HintStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [targetPosition, setTargetPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [visible, setVisible] = useState(false);
  const {theme} = useTheme();

  const registerStep = (step: HintStep) => {
    setSteps(prev => [...prev, step]);
  };

  const startTour = async () => {
    const tourSeen = await AsyncStorage.getItem('hint_tour_seen');
    if (tourSeen === 'true' || steps.length === 0) return;
    setCurrentIndex(0);
    setVisible(true);
  };

  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < steps.length) {
      const step = steps[currentIndex];
      if (step.targetRef.current) {
        step.targetRef.current.measure((x, y, w, h, pageX, pageY) => {
          setTargetPosition({x: pageX, y: pageY, width: w, height: h});
        });
      }
    }
  }, [currentIndex, steps]);

  const goNext = () => {
    if (currentIndex + 1 < steps.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // پایان تور
      setVisible(false);
      AsyncStorage.setItem('hint_tour_seen', 'true');
      setCurrentIndex(-1);
    }
  };

  const goPrev = () => {
    if (currentIndex - 1 >= 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const stopTour = () => {
    setVisible(false);
    AsyncStorage.setItem('hint_tour_seen', 'true');
    setCurrentIndex(-1);
  };

  const currentStep = steps[currentIndex];

  return (
    <HintTourContext.Provider value={{registerStep, startTour}}>
      {children}
      {visible && currentStep && (
        <Modal transparent visible={visible} animationType="fade">
          <View style={styles.modalOverlay}>
            {/* نقطه هدف */}
            <View
              style={[
                styles.targetHighlight,
                {
                  top: targetPosition.y - 8,
                  left: targetPosition.x - 8,
                  width: targetPosition.width + 16,
                  height: targetPosition.height + 16,
                },
              ]}
            />
            {/* باکس راهنما */}
            <View
              style={[
                styles.tooltip,
                {
                  backgroundColor: theme.colors.card, // ← از تم گرفته می‌شود
                  top: targetPosition.y + targetPosition.height + 10,
                  left: targetPosition.x - 20,
                },
              ]}>
              <GlobalText style={styles.tooltipText}>
                {currentStep.text}
              </GlobalText>
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={goPrev} style={styles.navBtn}>
                  <GlobalText style={styles.navText}>قبلی</GlobalText>
                </TouchableOpacity>
                <TouchableOpacity onPress={goNext} style={styles.navBtn}>
                  <GlobalText style={styles.navText}>بعدی</GlobalText>
                </TouchableOpacity>
                <TouchableOpacity onPress={stopTour} style={styles.stopBtn}>
                  <GlobalText style={styles.stopText}>رد کردن</GlobalText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </HintTourContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  targetHighlight: {
    position: 'absolute',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff5bfa',
    backgroundColor: 'transparent',
  },
  tooltip: {
    position: 'absolute',
    borderRadius: 12,
    padding: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navBtn: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
  },
  stopBtn: {
    backgroundColor: '#ff5bfa',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export const useHintTour = () => {
  const ctx = useContext(HintTourContext);
  if (!ctx) throw new Error('useHintTour must be used within HintTourProvider');
  return ctx;
};
