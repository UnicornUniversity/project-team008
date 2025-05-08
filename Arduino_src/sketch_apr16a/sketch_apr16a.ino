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

// buffer to accumulate the digits
String inputBuffer = "";

void keypadEvent(KeypadEvent k) {
  if (kpd.getState() == PRESSED) {
    char key = k;

    // DEBUG message as JSON
    Serial.print("{\"event\":\"key\",\"value\":\"");
    Serial.print(key);
    Serial.println("\"}");

    if (key == '#') {
      // PIN complete – emit as JSON and reset buffer
      Serial.print("{\"event\":\"pin\",\"value\":\"");
      Serial.print(inputBuffer);
      Serial.println("\"}");
      inputBuffer = "";
    }
    else {
      // accumulate into buffer
      inputBuffer += key;
    }
  }
}

void setup() {
  Serial.begin(9600);
  kpd.addEventListener(keypadEvent);
}

void loop() {
  kpd.getKey();  // polls the keypad and triggers keypadEvent()

  if (Serial.available() > 0) {
    // read incoming line (up to '\n')
    String msg = Serial.readStringUntil('\n');

    // emit incoming message as JSON
    Serial.print("{\"event\":\"incoming\",\"value\":\"");
    Serial.print(msg);
    Serial.println("\"}");

    // special “START” handling
    if (msg == "START") {
      // notify that START matched
      Serial.println("{\"event\":\"start_equal\"}");
      inputBuffer = "";
    }
  }
}
