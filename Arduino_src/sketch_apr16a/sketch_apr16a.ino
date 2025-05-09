#include <Keypad.h>
#include <Arduino.h>
#include <Base64.h>

const String ArduinoId = "1";
const String key = "___.q§weqwdqwrefasgdgbfgjngfqweqw.-ssad....!e";
char encrypted[50];
char decrypted[50];

String xor_encrypt_base64(String message, const char* key) {
  int len = message.length();
  int key_len = strlen(key);

  char encrypted[len];

  // XOR encryption
  for (int i = 0; i < len; ++i) {
    encrypted[i] = message[i] ^ key[i % key_len];
  }

  // Base64 encoding
  int encodedLength = Base64.encodedLength(len);
  char encoded[encodedLength + 1];  // +1 for null terminator
  Base64.encode(encoded, encrypted, len);
  encoded[encodedLength] = '\0';

  return String(encoded);
}

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
    Serial.print("*");
    Serial.println("\"}");

    if (key == '#') {
      // PIN complete – emit as JSON and reset buffer
      Serial.print("{\"event\":\"pin\",\"value\":\"");
      Serial.print(xor_encrypt_base64(inputBuffer, key));
      Serial.print("\",\"arduinoId\":\"");
      Serial.print(ArduinoId);
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
