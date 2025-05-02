#include <Keypad.h>

const byte ROWS = 4, COLS = 3;
char keys[ROWS][COLS] = {
  {'1','2','3'},
  {'7','8','9'},
  {'4','5','6'},
  {'*','0','#'}
};
byte rowPins[ROWS] = {9, 8, 7, 6};
byte colPins[COLS] = {5, 4, 3};
Keypad kpd = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

void keypadEvent(KeypadEvent k) {
  if (kpd.getState() == PRESSED) Serial.println(k);
}

void setup() {
  Serial.begin(9600);
  kpd.addEventListener(keypadEvent);
}

void loop() {
  kpd.getKey();
}
