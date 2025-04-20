// sketch_apr16a.ino
#include <EEPROM.h>

constexpr uint8_t SALT_LEN  = 16;
constexpr uint16_t SALT_ADDR = 0;

uint8_t salt[SALT_LEN];

void ensureSalt() {
  bool ok = true;
  for (uint8_t i = 0; i < SALT_LEN; i++) {
    salt[i] = EEPROM.read(SALT_ADDR + i);
    if (salt[i] == 0xFF) ok = false;
  }
  if (!ok) {
    // first‑boot: seed from noise and store
    randomSeed(analogRead(A0) ^ micros());
    for (uint8_t i = 0; i < SALT_LEN; i++) {
      salt[i] = random(0, 256);
      EEPROM.write(SALT_ADDR + i, salt[i]);
    }
  }
}

void printSaltHex() {
  Serial.print("SALT:");
  for (uint8_t i = 0; i < SALT_LEN; i++) {
    if (salt[i] < 0x10) Serial.print('0');
    Serial.print(salt[i], HEX);
  }
  Serial.println();
}

void setup() {
  Serial.begin(9600);
  ensureSalt();
  printSaltHex();             // once, so Electron can pick it up
  Serial.println("UNO ready");
}

void loop() {
  if (Serial.available()) {
    String msg = Serial.readStringUntil('\n');
    msg.trim();
    // echo back exactly what we got
    Serial.print("MSG:");
    Serial.println(msg);
  }
  delay(10);
}
